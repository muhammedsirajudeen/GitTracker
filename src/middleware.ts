// middleware.ts
import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwtHelper';
import { HttpStatus, HttpStatusMessage } from './lib/HttpStatus';
import { frontendUrl } from './lib/backendUrl';
const rateLimits: Map<string, { count: number; expiresAt: number }> = new Map();
const limit = 1000000;  // Max requests per minute
const ttl = 60 * 1000; // 60 seconds TTL

export async function middleware(request: NextRequest) {
    try {    

        // const ip = request.ip;
        // const key = `rate-limit:${ip}`;
        // const limit = 100;
        // const current = await client.incr(key);
        // if (current === 1) {
        //     await client.expire(key, 60);
        // }
        // if (current > limit) {
        //     return NextResponse.redirect(new URL('/verifybot', request.url));
        // }
        // client.disconnect()
        if(request.url.includes('_next')){
            return NextResponse.next()
        }
        const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
        const key = `rate-limit:${ip}`;
        if(request.url.includes('verifybot')){

            return NextResponse.next()
        }
        if(request.url.includes('clearcache')){
            rateLimits.delete(key)
            return NextResponse.redirect(new URL('/home', request.url));
        }
        const currentTime = Date.now();
        
    
        // Check if the IP is in the rate-limiting store
        let rateLimit = rateLimits.get(key);
    
        if (rateLimit) {
          // If the expiration time has passed, reset the count
          if (rateLimit.expiresAt < currentTime) {
            rateLimit = { count: 1, expiresAt: currentTime + ttl }; // Reset count and set new expiration
            rateLimits.set(key, rateLimit);
          } else {
            rateLimit.count += 1;
          }
        } else {
          // If the IP is not found, initialize it
          rateLimit = { count: 1, expiresAt: currentTime + ttl };
          rateLimits.set(key, rateLimit);
        }
    
        // If the request count exceeds the limit, redirect to /verifybot
        if (rateLimit.count > limit) {
            if(request.url.includes('/api')){
                return NextResponse.json({message:HttpStatusMessage[HttpStatus.TOO_MANY_REQUESTS]},{status:HttpStatus.TOO_MANY_REQUESTS})
            }
          return NextResponse.redirect(new URL('/verifybot', request.url));
        }
        /*
            @muhammedsirajudeen
            Todo:
            request.url should go to env this is a hacky solution
        */
        if(request.url.includes('login')||request.url.includes('signup')||request.url===frontendUrl+'/'){
            const cookies=parse(request.headers.get('cookie') || '')
            const access_token=cookies['access_token']
            const decodedUser=await verifyToken(access_token as string)
            if(decodedUser){
                return NextResponse.redirect(new URL('/', request.url));        
            }
            return NextResponse.next();
        }

    } catch (error) {
        console.log(error)
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/login', '/signup','/(.*)']
};