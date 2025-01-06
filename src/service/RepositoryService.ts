import RepoRepositoryInstance from "@/app/repository/RepoRepository";
import { Repository } from "@/models/Repository";

interface IRepository {
    addRepo: (repo: Repository) => Promise<boolean | null>
    getRepoByFullName:(fullname:string,owner_id:string)=>Promise<boolean|null>
    getRepoByUser:(userid:string)=>Promise<Repository[]>
}
class RepositoryService implements IRepository {
    _Repository: IRepository
    constructor(Repository: IRepository) {
        this._Repository = Repository
    }
    async addRepo(repo: Repository) {
        const status=await this._Repository.addRepo(repo)
        return status
    };
    async getRepoByFullName (fullname: string,owner_id:string) {
        return this._Repository.getRepoByFullName(fullname,owner_id)
    };
    async getRepoByUser (userid: string) {
        const repositories=await this._Repository.getRepoByUser(userid)
        return repositories
    };
}

const RepositoryServiceInstance = new RepositoryService(RepoRepositoryInstance)
export default RepositoryServiceInstance