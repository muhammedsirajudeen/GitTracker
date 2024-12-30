import UserModel, { IUser, User } from "@/models/User"
import { Model } from "mongoose"

export interface IUserRepository {
    getUserByEmail: (email: string) => Promise<User | null>
    InsertUser: (user: User) => Promise<boolean>
    VerifyUser:(user:string)=>Promise<boolean>
}


class UserRepository implements IUserRepository {
    _userModel: Model<IUser>
    constructor(userModel: Model<IUser>) {
        this._userModel = userModel
    }
    async getUserByEmail(email: string) {
        console.log(email)
        const user = await this._userModel.findOne({ email: email })
        if (user) {
            return user
        } else {
            return null
        }
    };
    async InsertUser(user: User) {
        try {
            const newUser = new this._userModel(user)
            await newUser.save()
            return true
        } catch (error) {
            console.log(error)
            return false
        }

    };
    async VerifyUser(email: string) {
        try {
            const findUser=await this._userModel.findOne({email})
            if(findUser){
                findUser.verified=true
                await findUser.save()
                return true
            }
            return false
        } catch (error) {
            console.log(error)
            return false
        }
    };
}

const UserRepostoryInstance = new UserRepository(UserModel)

export default UserRepostoryInstance