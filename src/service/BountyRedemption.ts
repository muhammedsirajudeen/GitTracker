import { IBountyRedemptionRepo } from "@/app/repository/BountyRedemption";
import { BountyRedemption } from "@/models/BountyRedemption";

interface IBountyRedemptionService{
    addBountyRedemption:(bountyredemption:BountyRedemption)=>Promise<BountyRedemption|null>
}
class BountyRedemptionService implements IBountyRedemptionService{
    _BountyRedemptionRepo:IBountyRedemptionRepo
    constructor(BountyRedemptionRepo:IBountyRedemptionRepo){
        this._BountyRedemptionRepo = BountyRedemptionRepo;
    }
    addBountyRedemption(bountyredemption: BountyRedemption){
        return this._BountyRedemptionRepo.addBountyRedemption(bountyredemption)
    };

} 

