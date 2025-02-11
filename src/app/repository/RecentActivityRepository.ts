import RecentActivityModel, { IRecentActivity,RecentActivity } from "@/models/RecentActivity";

export interface IRecentActivityRepository {
    createActivity(activity: Omit<RecentActivity, '_id'>): Promise<IRecentActivity>;
    getActivityById(id: string): Promise<IRecentActivity | null>;
    getAllActivities(): Promise<IRecentActivity[]>;
    updateActivity(id: string, activity: Partial<IRecentActivity>): Promise<IRecentActivity | null>;
    deleteActivity(id: string): Promise<boolean>;
}





class RecentActivityRepository implements IRecentActivityRepository {
  // Create a new activity
  async createActivity(activity: Omit<RecentActivity, '_id'>): Promise<IRecentActivity> {
    const newActivity = new RecentActivityModel(activity);
    return newActivity.save();
  }

  // Get a specific activity by ID
  async getActivityById(id: string): Promise<IRecentActivity | null> {
    return RecentActivityModel.findById(id).exec();
  }

  // Get all activities
  async getAllActivities(): Promise<IRecentActivity[]> {
    return RecentActivityModel.find().exec();
  }

  // Update an activity by ID
  async updateActivity(id: string, activity: Partial<IRecentActivity>): Promise<IRecentActivity | null> {
    return RecentActivityModel.findByIdAndUpdate(id, activity, { new: true }).exec();
  }

  // Delete an activity by ID
  async deleteActivity(id: string): Promise<boolean> {
    const result = await RecentActivityModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}

const RecentAcivityRepositoryInstance=new RecentActivityRepository()
// export default RecentActivityRepository;
export default RecentAcivityRepositoryInstance
