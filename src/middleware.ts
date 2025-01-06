// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    //try addding the verify logic operation here
    console.log(request.headers.get('cookie'))
    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/signup','/'], 
};