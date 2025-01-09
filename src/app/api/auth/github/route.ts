import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { generateSixDigitRandomNumber } from "../signup/route";
import { hashPassword } from "@/lib/bcryptHelper";
import UserServiceInstance from "@/service/UserService";
import { generateToken, verifyToken } from "@/lib/jwtHelper";
import { User } from "@/models/User";
import { parse } from "cookie";
import { RedisOtpHelper } from "@/lib/redisHelper";
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";

export interface UserWithId extends User {
  id: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");
    const cookies = parse(request.headers.get('cookie') || '');
    const access_token_jwt = cookies['access_token'] ?? "";

    if (!code) {
      return NextResponse.error();
    }

    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      new URLSearchParams({
        client_id: process.env.GITHUB_CLIENTID!,
        client_secret: process.env.GITHUB_SECRET!,
        code: code,
        redirect_uri: process.env.REDIRECT_URI!
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }
    );

    const accessToken = response.data.access_token;

    const decodedUser =await  verifyToken(access_token_jwt) as UserWithId;
    console.log(decodedUser)
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let email = userResponse.data.login; //this is actually the username
    if (decodedUser) {
      email = decodedUser.email;
    }
    const password = await hashPassword(generateSixDigitRandomNumber().toString());
    const user = await UserServiceInstance.getUserByEmail(email) as UserWithId;
    const newUserBody = { email: email, verified: true,id:""};
    if (!user) {
      const newUser = await UserServiceInstance.InsertUser({ email: email, password: password, verified: true, avatar_url: userResponse.data.avatar_url }) as UserWithId;
      newUserBody.id=newUser.id
      if (!newUser) {
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
      }
    }
    newUserBody.id=user.id
    //overriding part
    if (decodedUser) {
      newUserBody.email = decodedUser.email;
      newUserBody.id = decodedUser.id;
    }


    // Set cookies
    const responseWithCookie = NextResponse.redirect(new URL('/home', request.url));
    const token = generateToken(newUserBody);
    const refresh_token=generateToken(newUserBody,'1d')
    //adding refresh token to the cache
    await RedisOtpHelper(user.email,refresh_token,'refresh')
    responseWithCookie.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
    });

    console.log(token);
    responseWithCookie.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    responseWithCookie.cookies.set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return responseWithCookie;

  } catch (error) {
    // console.error('Error during GitHub OAuth process:', error);
    // const responseWithCookie = NextResponse.redirect(new URL('/home', request.url));
    // return responseWithCookie;
    console.log(error)
    return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
  }
}
