import { User } from "@/models/User"
import UserServiceInstance from "@/service/UserService"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const signupRequest=await request.json() as User
        //move into repostiory
        const findUser=await UserServiceInstance.getUserByEmail(signupRequest.email)
        console.log(findUser)
        if(findUser){
            return NextResponse.json({message:'user with email exists'},{status:409})
        }else{
            const newUser=await UserServiceInstance.InsertUser(signupRequest)
            if(newUser){
                return NextResponse.json({ message: 'success' },{status:201}) //for created wooho
            }else{
                return NextResponse.json({ message: 'please try again' },{status:500}) //for created wooho

            }
        }        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:'Internal Server Error Occured'},{status:500})
    }
}   