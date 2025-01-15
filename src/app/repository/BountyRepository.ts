import BountyModel, { Bounty, IBounty } from "@/models/Bounty"
import mongoose, { Model } from "mongoose"

export interface IBountyRepository {
    addBounty: (bounty:Bounty) => Promise<Bounty | null>;
    getBounties: (repositoryId:string) => Promise<Bounty[] | null>;
    getBountyByIssueId: (issueId:string) => Promise<boolean>
    deleteBountyById: (id:string) => Promise<boolean>
    getBountyById:(id:string) => Promise<Bounty|null>
    getAllBounties:()=>Promise<Bounty[]|null>
}

class BountyRepository implements IBountyRepository {
    _BountyModel: Model<IBounty>
    constructor(BountyModel: Model<IBounty>) {
        this._BountyModel = BountyModel
    }
    async addBounty(bounty: Bounty): Promise<Bounty | null> {
        try {
            const newBounty=new this._BountyModel(bounty)
            return await newBounty.save()
        } catch (error) {
            console.log(error)
            return null
        }
    };
    //pass the owner id here too
    async getBounties(repositoryId:string): Promise<Bounty[] | null> {
       const bounties=await this._BountyModel.find({repositoryId:new mongoose.Types.ObjectId(repositoryId)}) as Bounty[]
       return bounties
    }
    async getBountyByIssueId(issueId:string): Promise<boolean> {
        const bounty=await this._BountyModel.findOne({issueId})
        if(bounty){
            return true
        }else{
            return false
        }
    }
    async deleteBountyById(bountyId:string): Promise<boolean> {
        try {
            await this._BountyModel.deleteOne({_id:bountyId})
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    };
    async getBountyById(id:string): Promise<Bounty|null> {
        const bounty=await this._BountyModel.findById(id)
        return bounty
    }
    async getAllBounties(): Promise<Bounty[]|null> {
        const bounties = await this._BountyModel.find()
        .populate({ path: 'repositoryId' })
        .populate({ path: 'ownerId', select: 'email avatar_url' }) as Bounty[];
        return bounties
    }

}

const BountyRepositoryInstance = new BountyRepository(BountyModel)
export default BountyRepositoryInstance