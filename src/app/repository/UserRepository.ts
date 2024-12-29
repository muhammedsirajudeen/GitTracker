import UserModel, { IUser, User } from "@/models/User"
import { Model } from "mongoose"

export interface IUserRepository{
    getUserByEmail:(email:string)=>Promise<User | null>
    InsertUser:(user:User)=>void
}


class UserRepository implements IUserRepository{
    _userModel:Model<IUser>
    constructor(userModel:Model<IUser>){
        this._userModel=userModel
    }
    async getUserByEmail (email: string) {

        console.log(email)
        const user=await this._userModel.findOne({email:email})
        if(user){
            return user
        }else{
            return null
        }
    };
    InsertUser(user: User){
        console.log(user)
    };
}

const UserRepostoryInstance=new UserRepository(UserModel)

export default UserRepostoryInstance