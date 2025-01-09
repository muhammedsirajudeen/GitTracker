// app/route.ts
import { HttpStatus, HttpStatusMessage } from '@/lib/HttpStatus';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    // Delete each cookie
    allCookies.forEach((cookie) => {
      cookieStore.delete(cookie.name);
    });
    // Perform any additional logic here
    return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK});
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]}, {status: HttpStatus.INTERNAL_SERVER_ERROR});
}
}
