import RepositoryModel, { IRepositoryModel, Repository } from "@/models/Repository";
import mongoose, { Model } from "mongoose";

export interface IRepoRepository {
    addRepo: (repo: Repository) => Promise<Repository | null>
    getRepoByFullName:(fullname:string,owner_id:string)=>Promise<boolean|null>
    getRepoByUser:(userid:string,name:string,page?:number)=>Promise<Repository[]>
    deleteRepo:(userid:string)=>Promise<boolean|null>
    getRepoById:(id:string)=>Promise<Repository|null>
    increaseClosedIssuesCount:(id:string)=>Promise<boolean|null>
}
class RepoRepository implements IRepoRepository {
    _RepoModel: Model<IRepositoryModel>
    Page_Limit=10
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
            const savedRepo=await newRepo.save()
            return savedRepo
        } catch (error) {
            console.log(error)
            return null
        }
    };
    async getRepoByFullName (fullname: string,owner_id:string) {
        try {
            const getRepo=await this._RepoModel.findOne({full_name:fullname,owner_id:new mongoose.Types.ObjectId(owner_id)})
            if(getRepo){
                return true
            }
            return false
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async getRepoByUser (userid: string,name:string,page?:number) {
        console.log(page,name)
        const repositories=await this._RepoModel.find({owner_id:new mongoose.Types.ObjectId(userid),name:new RegExp(name)}).limit(this.Page_Limit).skip((page || page===0)?this.Page_Limit*page:this.Page_Limit)
        return repositories
    };
    async deleteRepo (repoid: string) {
        try {            
            const data=await this._RepoModel.deleteOne({_id:new mongoose.Types.ObjectId(repoid)})
            if(data.deletedCount!==0){
                return true
            }else{
                return false
            }
        } catch (error) {
            console.log(error)
            return null
        }
    };
    async getRepoById (id: string) {
        const repository=this._RepoModel.findById(id)
        return repository
    };
    async increaseClosedIssuesCount(id: string) {
        try {
            console.log(id)
            const repository=await this._RepoModel.findById(id)
            if(repository){
                if(!repository.closed_issues_count) repository.closed_issues_count = 0
                repository.closed_issues_count = repository.closed_issues_count + 1
                await repository.save()
            }
            return true
        } catch (error) {
            console.log(error)
            return null
        }
    };

}

const RepoRepositoryInstance = new RepoRepository(RepositoryModel)
export default RepoRepositoryInstance