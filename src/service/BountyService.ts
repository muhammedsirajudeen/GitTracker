import BountyRepositoryInstance, { IBountyRepository } from "@/app/repository/BountyRepository";
import { Bounty } from "@/models/Bounty";

interface IBountyService{
    addBounty: (bounty: Bounty) => Promise<Bounty | null>;
    getBounties: (repositoryId:string) => Promise<Bounty[] | null>;
    deleteBountyById: (bountyId:string) => Promise<boolean>
    getAllBounties: (userId:string) => Promise<Bounty[] | null>;
    addAssignee:(userid:string,bountyid:string)=>Promise<boolean>
    getBountyByAssignee:(userid:string)=>Promise<Bounty|null>

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
    async deleteBountyById(bountyId:string){
        const bounty=await this._BountyRepository.getBountyById(bountyId)
        if(!bounty){
            return false;  //bounty not found make it explicit 
        }
        if(bounty.assignees.length > 0){
            return false    //bounty has already been assigned
        }
        return this._BountyRepository.deleteBountyById(bountyId)
    }
    async getAllBounties(userId:string){
        return this._BountyRepository.getAllBounties(userId)
    }
    async addAssignee(userid:string,bountyid:string){
        return this._BountyRepository.addAssignee(userid,bountyid)
    }
    async getBountyByAssignee(userid:string){
        return this._BountyRepository.getBountyByAssignee(userid)
    }

}

const BountyServiceInstance = new BountyService(BountyRepositoryInstance)
export default BountyServiceInstance