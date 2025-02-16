import { hashPassword } from "@/lib/bcryptHelper"
import UserModel, { IUser, User } from "@/models/User"
import  { Model } from "mongoose"
import BaseRepository from "./BaseRepository"

export interface IUserRepository {
    getUserByEmail: (email: string) => Promise<User | null>
    InsertUser: (user: User) => Promise<User|null>
    VerifyUser: (user: string) => Promise<boolean>
    changePassword:(userid:string,password:string)=>Promise<boolean>
    getUserById:(userid:string)=>Promise<User|null>
    updateUserByWallet:(userid:string,User:Partial<User>)=>Promise<boolean>
    // verifyAdmin:(email:string,password:string)=>Promise<boolean>
    getAllUsersAdmin:(page:number,filter:string)=>Promise<User[]>
    getCountsOfUser:()=>Promise<number>
}


class UserRepository extends BaseRepository implements IUserRepository {
    _userModel: Model<IUser>
    constructor(userModel: Model<IUser>) {
        super()
        this._userModel = userModel
    }
    async getAllUsersAdmin(page:number,filter:string) {
        const users = await this._userModel.find({role:{$ne:"admin"},email:{$regex:new RegExp(filter)}}).select('-password').limit(this.PAGE_LIMIT).skip(page*this.PAGE_LIMIT)
        return users
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
            console.log('getUserById')
            return this._userModel.findById(userid).select('-password')
        } catch (error) {
            console.log(error)
            return null
        }
    };
    async updateUserByWallet(userid:string,User:Partial<User>){
        try {
            await this._userModel.updateOne({_id:userid},User);
            return true
        } catch (error) {
            const repoError:Error=error as Error
            this._logger.error(repoError.message)
            return false
        }
    }
    async getCountsOfUser(){
        try {
            return await this._userModel.find().countDocuments()
        } catch (error) {
            const repoError=error as Error
            this._logger.error(repoError.message)
            return 0
        }
    }

}

const UserRepostoryInstance = new UserRepository(UserModel)

export default UserRepostoryInstance