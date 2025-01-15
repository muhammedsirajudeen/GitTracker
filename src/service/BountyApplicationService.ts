import BountyApplicationRepoInstance, { IBountyApplicationRepository } from "@/app/repository/BountyApplicationRepository";
import { BountyApplication } from "@/models/BountyApplication";
import mongoose from "mongoose";

interface IBountyApplicationService{
    addBountyApplication: (application:BountyApplication)=>Promise<BountyApplication|null>
    getApplicationByBountyIdAndApplicant:(bountyId:string,applicantId:string)=>Promise<BountyApplication|null>
}

class BountyApplicationService implements IBountyApplicationService {
    _bountyApplicationRepository: IBountyApplicationRepository
    constructor(bountyApplicationRepository:IBountyApplicationRepository){
        this._bountyApplicationRepository = bountyApplicationRepository;
    }
    async addBountyApplication(application: BountyApplication){
        //check if bounty exists
        const bountyApplication = await this._bountyApplicationRepository.getApplicationByIdandApplicant(new mongoose.Types.ObjectId(application.bountyId),new mongoose.Types.ObjectId(application.applicantId))        
        if(bountyApplication){
            return null //bounty application already exists for this bounty and applicant
        }
        return this._bountyApplicationRepository.addBountyApplication(application)
    }
    async getApplicationByBountyIdAndApplicant(bountyId:string,applicantId:string){
        return this._bountyApplicationRepository.getApplicationByIdandApplicant(new mongoose.Types.ObjectId(bountyId),new mongoose.Types.ObjectId(applicantId))
    }
}

const BountyApplicationServiceInstance = new BountyApplicationService(BountyApplicationRepoInstance)
export default BountyApplicationServiceInstance