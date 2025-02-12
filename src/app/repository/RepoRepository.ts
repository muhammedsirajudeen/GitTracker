import RepositoryModel, { IRepositoryModel, Repository } from "@/models/Repository";
import mongoose, { Model } from "mongoose";
import BaseRepository from "./BaseRepository";
import RecentActivityServiceInstance from "@/service/RecentActivityService";

export interface IRepoRepository {
    addRepo: (repo: Repository) => Promise<Repository | null>
    getRepoByFullName:(fullname:string,owner_id:string)=>Promise<boolean|null>
    getRepoByUser:(userid:string,name:string,page?:number)=>Promise<Repository[]>
    deleteRepo:(userid:string)=>Promise<boolean|null>
    getRepoById:(id:string)=>Promise<Repository|null>
    increaseClosedIssuesCount:(id:string)=>Promise<boolean|null>
    getAllRepoAdmin:(page:number,filter:string)=>Promise<Repository[]>
    getRepositoriesCount:()=>Promise<number>
}
class RepoRepository extends BaseRepository  implements IRepoRepository {
    _RepoModel: Model<IRepositoryModel>
    Page_Limit=10
    constructor(RepoModel: Model<IRepositoryModel>) {
        super()
        this._RepoModel = RepoModel
    }
    async getAllRepoAdmin(page:number,filter:string) {
        return this._RepoModel.find({name:{$regex:new RegExp(filter)}}).populate(
            [
                {
                    path:'owner_id',
                    select:'email avatar_url'
                }
            ]
        ).limit(this.Page_Limit).skip(this.Page_Limit*page)
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
            await RecentActivityServiceInstance.createActivity({type:"repository",date:new Date().toDateString(),message:"Repository Created"})
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
        this._logger.info(`fetching repo of user ${userid}`)
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
    async getRepositoriesCount(){
        try {
            return await this._RepoModel.find().countDocuments()
        } catch (error) {
            const repoError=error as Error
            this._logger.error(repoError.message)
            return 0
        }
    }

}

const RepoRepositoryInstance = new RepoRepository(RepositoryModel)
export default RepoRepositoryInstance