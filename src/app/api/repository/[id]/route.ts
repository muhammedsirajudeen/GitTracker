import RepoRepositoryInstance from "@/app/repository/RepoRepository"
import { NextResponse } from "next/server"

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
        return NextResponse.json({message:"Internal server error occured"},{status:500})
    }
}