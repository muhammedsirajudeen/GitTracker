import BountyModel, { Bounty, IBounty } from "@/models/Bounty"
import mongoose, { Model } from "mongoose"

export interface IBountyRepository {
    addBounty: (bounty:Bounty) => Promise<Bounty | null>;
    getBounties: (repositoryId:string) => Promise<Bounty[] | null>;
    getBountyByIssueId: (issueId:string) => Promise<boolean>
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

}

const BountyRepositoryInstance = new BountyRepository(BountyModel)
export default BountyRepositoryInstance