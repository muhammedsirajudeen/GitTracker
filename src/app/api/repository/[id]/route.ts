export const dynamic = "force-dynamic";

import RepoRepositoryInstance from "@/app/repository/RepoRepository"
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request:Request,{params}:{params:{id:string}}){
    try {
        const {id}=params
        console.log(id)
        const cookie=cookies()
        const access_token=cookie.get('access_token')
        if(!access_token){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const repository=await RepoRepositoryInstance.getRepoById(id)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],repository},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}
//try to orotect all these endpoints like only owner can delete the repo
export async function DELETE(request:Request,{params}:{params:{id:string}}){
    try {
        const {id}=params
        console.log(id)
        const status=await RepoRepositoryInstance.deleteRepo(id)
        if(status){
            return NextResponse.json({message:"success"},{status:200})
        }else{
            return NextResponse.json({message:'resource not found'},{status:404})
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}