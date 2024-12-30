import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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

    const responseWithCookie = NextResponse.redirect(new URL('/home', request.url));

    responseWithCookie.cookies.set('access_token', accessToken, {
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
