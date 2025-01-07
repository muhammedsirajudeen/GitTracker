import RepoRepositoryInstance, { IRepoRepository } from "@/app/repository/RepoRepository";
import { Repository } from "@/models/Repository";

interface IRepository {
    addRepo: (repo: Repository) => Promise<Repository | null>
    getRepoByFullName: (fullname: string, owner_id: string) => Promise<boolean | null>
    getRepoByUser: (userid: string,name:string,page?:number,) => Promise<Repository[]>
    deleteRepo:(repoid:string)=>Promise<null|boolean>
    getRepoById:(userid:string)=>Promise<Repository|null>
}
class RepositoryService implements IRepository {
    _Repository: IRepoRepository
    constructor(Repository: IRepoRepository) {
        this._Repository = Repository
    }
    async addRepo(repo: Repository) {
        const status = await this._Repository.addRepo(repo)
        return status
    };
    async getRepoByFullName(fullname: string, owner_id: string) {
        return this._Repository.getRepoByFullName(fullname, owner_id)
    };
    async getRepoByUser(userid: string,name:string,page?:number) {
        const repositories = await this._Repository.getRepoByUser(userid,name,page)
        return repositories
    };
    async deleteRepo (repoid: string){
        return this._Repository.deleteRepo(repoid)
    };
    async getRepoById (userid: string) {
        return this._Repository.getRepoById(userid)
    };
}

const RepositoryServiceInstance = new RepositoryService(RepoRepositoryInstance)
export default RepositoryServiceInstance