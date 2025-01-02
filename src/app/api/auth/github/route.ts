import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { generateSixDigitRandomNumber } from "../signup/route";
import { hashPassword } from "@/lib/bcryptHelper";
import UserServiceInstance from "@/service/UserService";
import { generateToken } from "@/lib/jwtHelper";
import { User } from "@/models/User";

export interface UserWithId extends User{
  id:string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");

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

    if (!accessToken) {
      return NextResponse.error();
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(userResponse.data); 
    const email=userResponse.data.login //this is actually the username
    const password=await hashPassword(generateSixDigitRandomNumber().toString())
    const user=await UserServiceInstance.getUserByEmail(email) as UserWithId
    const newUserBody={email:email,verified:true,id:user.id}
    if(!user){
      const newUser=UserServiceInstance.InsertUser({email:email,password:password,verified:true,avatar_url:userResponse.data.avatar_url})
      if(!newUser){
        return NextResponse.json({message:'internal server error'},{status:500})
      }
    }
    const responseWithCookie = NextResponse.redirect(new URL('/home', request.url));
    const token=generateToken(newUserBody)
    responseWithCookie.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 60 * 60 * 24 * 7, 
    });
    responseWithCookie.cookies.set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 60 * 60 * 24 * 7, 
    });

    return responseWithCookie;

  } catch (error) {
    console.error('Error during GitHub OAuth process:', error);
    return NextResponse.error();
  }
}
