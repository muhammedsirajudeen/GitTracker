// import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
// import Logger from "@/lib/LoggerHelper";
// import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };
  
// export async  function GET(request:NextRequest){
// try {
//     Logger._logger.info(request.url)
//     const user=await GetUserGivenAccessToken(cookies())
//     if(!user){
//         return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
//     }
//     const formData=await request.formData()
//     console.log(formData)
//     return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
// } catch (error) {
//     const controllerError=error as Error
//     Logger._logger.error(controllerError.message)
//     return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
// }
// }