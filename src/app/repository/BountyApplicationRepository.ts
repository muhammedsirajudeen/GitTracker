import BountyApplicationModel, { BountyApplication, IBountyApplication } from "@/models/BountyApplication";
import mongoose, { Model } from "mongoose";
import BaseRepository from "./BaseRepository";

export interface IBountyApplicationRepository{
    addBountyApplication: (BountyApplication: BountyApplication) => Promise<BountyApplication|null>
    getApplicationByIdandApplicant:(bountyId:mongoose.Types.ObjectId,applicantId:mongoose.Types.ObjectId) => Promise<BountyApplication|null>
    getBountyApplicationByUser:(userId:mongoose.Types.ObjectId,bountyId:mongoose.Types.ObjectId) => Promise<BountyApplication[]|null>
    getBountyApplicationByApplicant:(userId:string)=>Promise<string[]|null>
}

class BountyApplicationRepository extends BaseRepository implements IBountyApplicationRepository  {
    _BountyApplicationModel: Model<IBountyApplication>
    constructor(BountyApplicationModel: Model<IBountyApplication>) {
        super()
        this._BountyApplicationModel = BountyApplicationModel
    }
    async addBountyApplication(bountyApplication: BountyApplication){

        return this._BountyApplicationModel.create(bountyApplication)
    }
    async getApplicationByIdandApplicant(bountyId:mongoose.Types.ObjectId,applicantId:mongoose.Types.ObjectId){
        return this._BountyApplicationModel.findOne({bountyId,applicantId})
    }
    async getBountyApplicationByUser(userId:mongoose.Types.ObjectId,bountyId:mongoose.Types.ObjectId){
        console.log(userId,bountyId)
        return this._BountyApplicationModel.find({bountyId}).populate(['applicantId','bountyId']);
    }
    async getBountyApplicationByApplicant(userId:string){
        try {
            const appliedBounties:string[]=[]
            const applications=await this._BountyApplicationModel.find({applicantId:new mongoose.Types.ObjectId(userId)}).lean() as unknown as BountyApplication[]
            applications.forEach(application=>{
                appliedBounties.push(application.bountyId as unknown as string)
            })

            return appliedBounties
        } catch (error) {
            const ErrorObject=error as Error
            this._logger.error(ErrorObject.message)
            return null
        }
    }

}

const BountyApplicationRepoInstance = new BountyApplicationRepository(BountyApplicationModel)
export default BountyApplicationRepoInstance