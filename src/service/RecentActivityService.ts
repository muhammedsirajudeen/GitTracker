import RecentAcivityRepositoryInstance, { IRecentActivityRepository } from "@/app/repository/RecentActivityRepository";
import { IRecentActivity, RecentActivity } from "@/models/RecentActivity";

interface IRecentActivityService{
    getActivities():Promise<IRecentActivity[]>
    createActivity(activity: Omit<RecentActivity, '_id'>): Promise<IRecentActivity>;
}

class RecentActivityService implements IRecentActivityService{
    _RecentActivityRepo:IRecentActivityRepository
    constructor(RecentActivityRepo:IRecentActivityRepository){
        this._RecentActivityRepo = RecentActivityRepo
    }
    async getActivities(): Promise<IRecentActivity[]> {
        return await this._RecentActivityRepo.getAllActivities()
    }
    async createActivity(activity: Omit<RecentActivity, '_id'>): Promise<IRecentActivity> {
        // throw new Error("Method not implemented.");
        return await this._RecentActivityRepo.createActivity(activity)
    }
}

const RecentActivityServiceInstance=new RecentActivityService(RecentAcivityRepositoryInstance)
export default RecentActivityServiceInstance