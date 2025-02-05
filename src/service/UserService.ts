import UserRepostoryInstance, { IUserRepository } from "@/app/repository/UserRepository"
import { verifyPassword } from "@/lib/bcryptHelper"
import { User } from "@/models/User"

interface IUserService {
    getUserByEmail: (email: string) => Promise<User | null>
    InsertUser: (user: User) => Promise<User|null>
    VerifyUser:(email:string)=>Promise<boolean>
    changePassword:(userid:string,password:string)=>Promise<boolean>
    getUserById:(userid:string)=>Promise<User|null>
    updateUserById:(userid:string,User:Partial<User>)=>Promise<boolean>
    verifyAdmin:(email:string,password:string)=>Promise<boolean>
    getAllUsersAdmin:(page:number)=>Promise<User[]>
}
class UserService implements IUserService {
    _UserRepo: IUserRepository
    constructor(UserRepo: IUserRepository) {
        this._UserRepo = UserRepo
    }
    async getAllUsersAdmin(page:number){
        return this._UserRepo.getAllUsersAdmin(page)
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
    async getUserById (userid: string) {
        console.log('from inside ',userid)
        return this._UserRepo.getUserById(userid)
    };
    async updateUserById(userid:string,User:Partial<User>){
        return this._UserRepo.updateUserByWallet(userid,User)

    }
    async verifyAdmin(email:string,password:string){
        try {
            const user=await this._UserRepo.getUserByEmail(email)
            if(!(user?.role==="admin")){
                return false
            }
            const passwordVerified=await verifyPassword(password,user.password)
            if(!passwordVerified){
                return false
            }
            //code reachability ensures that only admin and verified users reach here
            return true
        } catch (error) {
            const repoError=error as Error
            console.log(repoError.message)
            return false
        }
    }

}
const UserServiceInstance = new UserService(UserRepostoryInstance)
export default UserServiceInstance
