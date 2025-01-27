import BountyRedemptionRepoInstance, { IBountyRedemptionRepo } from "@/app/repository/BountyRedemption";
import { BountyRedemption } from "@/models/BountyRedemption";

interface IBountyRedemptionService {
    addBountyRedemption: (bountyredemption: BountyRedemption,userid:string) => Promise<BountyRedemption | null>
    getBountyRedemptionById: (id: string) => Promise<BountyRedemption | null>
    getBountyRedemptions:()=>Promise<BountyRedemption[]>
    updateBountyRedemption:(bountyredemption:Partial<BountyRedemption>)=>Promise<boolean>
}
class BountyRedemptionService implements IBountyRedemptionService {
    _BountyRedemptionRepo: IBountyRedemptionRepo
    constructor(BountyRedemptionRepo: IBountyRedemptionRepo) {
        this._BountyRedemptionRepo = BountyRedemptionRepo;
    }
    async addBountyRedemption(bountyredemption: BountyRedemption,userid:string) {
        const existingBounty=await this._BountyRedemptionRepo.getbountyRedemptionByBountyId(bountyredemption.bountyId.toString())
        if(existingBounty && existingBounty.applicantId.toString()===userid){

            return await this._BountyRedemptionRepo.updateBountyRedemption(bountyredemption.bountyId.toString(),bountyredemption) as unknown as BountyRedemption
        }else if(existingBounty){
            return null
        }
        return this._BountyRedemptionRepo.addBountyRedemption(bountyredemption)
    };
    async getBountyRedemptionById(id: string): Promise<BountyRedemption | null> {
        return this._BountyRedemptionRepo.getbountyRedemptionByBountyId(id)
    }
    async getBountyRedemptions () {
        return this._BountyRedemptionRepo.getBountyRedemptions()
    };
    async updateBountyRedemption (bountyredemption: Partial<BountyRedemption>) {
        return this._BountyRedemptionRepo.updateBountyRedemption(bountyredemption.bountyId?.toHexString() as string,bountyredemption)
    };

}

const BountyRedemptionServiceInstance = new BountyRedemptionService(BountyRedemptionRepoInstance)
export default BountyRedemptionServiceInstance