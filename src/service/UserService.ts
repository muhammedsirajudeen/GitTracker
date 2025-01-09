import UserRepostoryInstance, { IUserRepository } from "@/app/repository/UserRepository"
import { User } from "@/models/User"

interface IUserService {
    getUserByEmail: (email: string) => Promise<User | null>
    InsertUser: (user: User) => Promise<User|null>
    VerifyUser:(email:string)=>Promise<boolean>
    changePassword:(userid:string,password:string)=>Promise<boolean>
}
class UserService implements IUserService {
    _UserRepo: IUserRepository
    constructor(UserRepo: IUserRepository) {
        this._UserRepo = UserRepo
    }
    async getUserByEmail(email: string) {
        const user = await this._UserRepo.getUserByEmail(email)
        return user
    };
    async InsertUser(user: User) {
        const status = await this._UserRepo.InsertUser(user)
        return status
    };
    async VerifyUser(email:string){
        const status=await this._UserRepo.VerifyUser(email)
        return status
    };
    async changePassword (userid: string, password: string) {
        return this._UserRepo.changePassword(userid,password)
    };

}
const UserServiceInstance = new UserService(UserRepostoryInstance)
export default UserServiceInstance
