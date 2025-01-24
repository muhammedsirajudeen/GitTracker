import { Model } from "mongoose";
import BaseRepository from "./BaseRepository";
import { BountyRedemption } from "@/models/BountyRedemption";

export interface IBountyRedemptionRepo{
    addBountyRedemption:(bountyredemption:BountyRedemption)=>Promise<BountyRedemption|null>
}

class BountyRedemptionRepo extends BaseRepository implements IBountyRedemptionRepo{
    _BountyRedemptionModel:Model<IBountyRedemptionRepo>
    constructor(model:Model<IBountyRedemptionRepo>){
        super()
        this._BountyRedemptionModel = model
    }
    async addBountyRedemption (bountyredemption: BountyRedemption){
        try {
            const _bountyredemption=new this._BountyRedemptionModel(bountyredemption)
            const newbounty=await _bountyredemption.save()
            return newbounty as unknown as BountyRedemption
        } catch (error) {
            const repoError=error as Error
            this._logger.error(repoError.message)
            return null
        }
    };
}