// app/route.ts
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
    return NextResponse.json({message:'success'},{status:200});
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:'error occured'})
}
}
