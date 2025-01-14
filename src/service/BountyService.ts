import BountyRepositoryInstance, { IBountyRepository } from "@/app/repository/BountyRepository";
import { Bounty } from "@/models/Bounty";

interface IBountyService{
    addBounty: (bounty: Bounty) => Promise<Bounty | null>;
    getBounties: (repositoryId:string) => Promise<Bounty[] | null>;
}

class BountyService implements IBountyService{
    _BountyRepository:IBountyRepository
    constructor(BountyRepository:IBountyRepository){
        this._BountyRepository = BountyRepository;
    }
    async addBounty(bounty:Bounty){
        //checking if it exists already
        const bountyStatus=await this._BountyRepository.getBountyByIssueId(bounty.issueId)
        if(bountyStatus){
            return null
        }
        return this._BountyRepository.addBounty(bounty)
    }
    async getBounties(repositoryId:string){
        return this._BountyRepository.getBounties(repositoryId)
    }
}

const BountyServiceInstance = new BountyService(BountyRepositoryInstance)
export default BountyServiceInstance