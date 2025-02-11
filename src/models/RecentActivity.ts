import mongoose, { Document, Schema } from 'mongoose';

type ActivityType = 'bounty' | 'chat' | 'repository' | 'bountycompletion' | 'securityalert';

export interface RecentActivity{
    _id:string
    type:ActivityType
    message:string
    date:string
}

export interface IRecentActivity extends Omit<RecentActivity,"date"|"_id">, Document {
  date: Date;
}

const recentActivitySchema = new Schema<IRecentActivity>({
  type: {
    type: String,
    enum: ['bounty', 'chat', 'repository', 'bountycompletion', 'securityalert'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const RecentActivity = mongoose.models.RecentActivity|| mongoose.model<IRecentActivity>('RecentActivity', recentActivitySchema);

export default RecentActivity;
