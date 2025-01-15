import BountyApplicationModel, { BountyApplication, IBountyApplication } from "@/models/BountyApplication";
import mongoose, { Model } from "mongoose";

export interface IBountyApplicationRepository{
    addBountyApplication: (BountyApplication: BountyApplication) => Promise<BountyApplication|null>
    getApplicationByIdandApplicant:(bountyId:mongoose.Types.ObjectId,applicantId:mongoose.Types.ObjectId) => Promise<BountyApplication|null>
    getBountyApplicationByUser:(userId:mongoose.Types.ObjectId,bountyId:mongoose.Types.ObjectId) => Promise<BountyApplication[]|null>
}

class BountyApplicationRepository implements IBountyApplicationRepository {
    _BountyApplicationModel: Model<IBountyApplication>
    constructor(BountyApplicationModel: Model<IBountyApplication>) {
        this._BountyApplicationModel = BountyApplicationModel
    }
    async addBountyApplication(bountyApplication: BountyApplication){
        return this._BountyApplicationModel.create(bountyApplication)
    }
    async getApplicationByIdandApplicant(bountyId:mongoose.Types.ObjectId,applicantId:mongoose.Types.ObjectId){
        return this._BountyApplicationModel.findOne({bountyId,applicantId})
    }
    async getBountyApplicationByUser(userId:mongoose.Types.ObjectId,bountyId:mongoose.Types.ObjectId){
        return this._BountyApplicationModel.find({applicantId:userId,bountyId}).populate(['applicantId','bountyId']);
    }

}

const BountyApplicationRepoInstance = new BountyApplicationRepository(BountyApplicationModel)
export default BountyApplicationRepoInstance