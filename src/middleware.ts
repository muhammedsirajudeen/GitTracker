// middleware.ts
import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwtHelper';

export async function middleware(request: NextRequest) {
    try {        
        //try addding the verify logic operation here
        // if(request.url.includes('api/')){
        //     if(request.url.includes('outbound/')){
        //         console.log('outbound request captured')
        //         // return NextResponse.next()
        //         return NextResponse.json({message:'success'})
        //     }
        //     return NextResponse.next();
        // } 
        const cookies=parse(request.headers.get('cookie') || '')
        const access_token=cookies['access_token']
        const decodedUser=await verifyToken(access_token as string)
        if(decodedUser){
            return NextResponse.redirect(new URL('/home', request.url));        
        }
        return NextResponse.next();

    } catch (error) {
        console.log(error)
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/login', '/signup','/']
};