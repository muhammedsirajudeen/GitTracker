import RepositoryModel, { IRepositoryModel, Repository } from "@/models/Repository";
import mongoose, { Model } from "mongoose";

interface IRepoRepository {
    addRepo: (repo: Repository) => Promise<boolean | null>
    getRepoByFullName:(fullname:string)=>Promise<boolean|null>
    getRepoByUser:(userid:string)=>Promise<Repository[]>
}
class RepoRepository implements IRepoRepository {
    _RepoModel: Model<IRepositoryModel>
    constructor(RepoModel: Model<IRepositoryModel>) {
        this._RepoModel = RepoModel
    }
    async addRepo(repo: Repository) {
        try {
            const RepoToAdd: Repository = { 
                full_name: repo.full_name, 
                name: repo.name, 
                description: repo.description, 
                language: repo.language, 
                stargazers_count: repo.stargazers_count ?? 0, 
                forks_count: repo.forks_count ?? 0,
                watchers_count:repo.watchers_count??0,
                owner_id:repo.owner_id 
            }
            const newRepo = new this._RepoModel(RepoToAdd)
            await newRepo.save()
            return true
        } catch (error) {
            console.log(error)
            return null
        }
    };
    async getRepoByFullName (fullname: string) {
        try {
            const getRepo=await this._RepoModel.findOne({full_name:fullname})
            if(getRepo){
                return true
            }
            return false
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async getRepoByUser (userid: string) {
        const repositories=await this._RepoModel.find({owner_id:new mongoose.Types.ObjectId(userid)})
        return repositories
    };

}

const RepoRepositoryInstance = new RepoRepository(RepositoryModel)
export default RepoRepositoryInstance