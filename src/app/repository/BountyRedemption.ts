import mongoose, { Model } from "mongoose";
import BaseRepository from "./BaseRepository";
import BountyRedemptionModel, { BountyRedemption, IBountyRedemptionModel } from "@/models/BountyRedemption";
import RecentActivityServiceInstance from "@/service/RecentActivityService";

export interface IBountyRedemptionRepo {
    addBountyRedemption: (bountyredemption: BountyRedemption) => Promise<BountyRedemption | null>
    getbountyRedemptionByBountyId:(bountyid:string)=>Promise<BountyRedemption|null>
    updateBountyRedemption:(bountyid:string,bountyRedemption:Partial<BountyRedemption>)=>Promise<boolean>
    getBountyRedemptions:()=>Promise<BountyRedemption[]>
}

class BountyRedemptionRepo extends BaseRepository implements IBountyRedemptionRepo {
    _BountyRedemptionModel: Model<IBountyRedemptionModel>
    constructor(model: Model<IBountyRedemptionModel>) {
        super()
        this._BountyRedemptionModel = model
    }
    async addBountyRedemption(bountyredemption: BountyRedemption) {
        try {
            const _bountyredemption = new this._BountyRedemptionModel(bountyredemption)
            const newbounty = await _bountyredemption.save()
            await RecentActivityServiceInstance.createActivity({type:"bountycompletion",date:new Date().toDateString(),message:"New bounty application submitted"})
            return newbounty as unknown as BountyRedemption
        } catch (error) {
            const repoError = error as Error
            this._logger.error(repoError.message)
            return null
        }
    };
    async getbountyRedemptionByBountyId(bountyId:string){
        try {
            const bountyRedemption=await this._BountyRedemptionModel.findOne({bountyId:new mongoose.Types.ObjectId(bountyId)})
            if(bountyRedemption){
                return bountyRedemption as unknown as BountyRedemption
            }
            return null
            //note that the failing condition here is false and the passing condition here is true
        } catch (error) {
            const repoError=error as Error
            this._logger.error(repoError.message)
            return null
        }
    }
    async updateBountyRedemption(bountyid:string,bountyRedemption:Partial<BountyRedemption>){
        try {
            // const checking=await this._BountyRedemptionModel.findOne({bountyId:new mongoose.Types.ObjectId(bountyid)})
            // console.log(checking)
            delete bountyRedemption.bountyId
            console.log(bountyid,bountyRedemption)
            const result=await this._BountyRedemptionModel.updateOne({bountyId:new mongoose.Types.ObjectId(bountyid)},{$set:bountyRedemption})
            if (result.modifiedCount > 0) {
                console.log('Update successful');
                return true;
            } else {
                console.log('No documents matched the query. Update not performed.');
                return false;
            }
        }catch (error){
            const repoError=error as Error
            this._logger.error(repoError.message)
            return false
        }
    }
    async getBountyRedemptions(){
        try {
            return this._BountyRedemptionModel.find().populate({path:'applicantId',select:'-password'}).populate('bountyId') as unknown as BountyRedemption[]            
        } catch (error) {
            const repoError=error as Error
            this._logger.error(repoError.message)
            return []
        }
    };

}
const BountyRedemptionRepoInstance = new BountyRedemptionRepo(BountyRedemptionModel)
export default BountyRedemptionRepoInstance