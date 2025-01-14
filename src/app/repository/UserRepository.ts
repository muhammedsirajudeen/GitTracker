import { hashPassword } from "@/lib/bcryptHelper"
import UserModel, { IUser, User } from "@/models/User"
import { Model } from "mongoose"

export interface IUserRepository {
    getUserByEmail: (email: string) => Promise<User | null>
    InsertUser: (user: User) => Promise<User|null>
    VerifyUser: (user: string) => Promise<boolean>
    changePassword:(userid:string,password:string)=>Promise<boolean>
    getUserById:(userid:string)=>Promise<User|null>
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
            const savedUser=await newUser.save()
            return savedUser
        } catch (error) {
            console.log(error)
            return null
        }

    };
    async VerifyUser(email: string) {
        try {
            const findUser = await this._userModel.findOne({ email })
            if (findUser) {
                findUser.verified = true
                await findUser.save()
                return true
            }
            return false
        } catch (error) {
            console.log(error)
            return false
        }
    };
    async changePassword (userid: string, password: string) {
        try {
            const user=await this._userModel.findById(userid)    
            if(!user){
                return false
            }
            user.password=await hashPassword(password)
            await user.save()
            return true

        } catch (error) {
            console.log(error)
            return false
        }
    };
    async getUserById (userid: string){
        try {
            return this._userModel.findById(userid).select('-password')
        } catch (error) {
            console.log(error)
            return null
        }
    };
}

const UserRepostoryInstance = new UserRepository(UserModel)

export default UserRepostoryInstance