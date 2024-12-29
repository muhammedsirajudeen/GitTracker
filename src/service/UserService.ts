import UserRepostoryInstance, { IUserRepository } from "@/app/repository/UserRepository"
import { User } from "@/models/User"

interface IUserService {
    getUserByEmail: (email: string) => Promise<User | null>
    InsertUser: (user: User) => Promise<boolean>
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
        console.log(user)
        const status = await this._UserRepo.InsertUser(user)
        return status
    };
}
const UserServiceInstance = new UserService(UserRepostoryInstance)
export default UserServiceInstance