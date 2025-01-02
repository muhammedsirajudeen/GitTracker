import RepoRepositoryInstance from "@/app/repository/RepoRepository";
import { Repository } from "@/models/Repository";

interface IRepository {
    addRepo: (repo: Repository) => Promise<boolean | null>
    getRepoByFullName:(fullname:string)=>Promise<boolean|null>
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
    async getRepoByFullName (fullname: string) {
        return this._Repository.getRepoByFullName(fullname)
    };
}

const RepositoryServiceInstance = new RepositoryService(RepoRepositoryInstance)
export default RepositoryServiceInstance