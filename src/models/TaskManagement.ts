import { UserWithId } from '@/app/api/auth/github/route';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { Repository } from './Repository';

// Define the Priority enum
export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export interface Task {
    _id:string
    taskTitle: string;
    issueId: string;
    description: string;
    priority: Priority;
    userId:string
    repositoryId:string

}
export interface PopulatedTask extends Omit<Task,"userId"|"repositoryId">{
    userId:UserWithId
    repositoryId:Repository
}

// Define the ITask interface
export interface ITask extends Omit<Task,"_id"|"userId"|"repositoryId">,Document {
    userId:mongoose.Types.ObjectId
    repositoryId:mongoose.Types.ObjectId
}

// Define the Task schema
const TaskSchema = new Schema<ITask>(
    {
        taskTitle: {
            type: String,
            required: true,
            trim: true,
        },
        issueId: {
            type: String,
            ref: "Issue",
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: Object.values(Priority),
            required: true,
        },
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User'
        },
        repositoryId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'Repository'
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt timestamps
    }
);
// Define the Task model
const TaskModel: Model<ITask> =mongoose.models?.Task|| mongoose.model<ITask>("Task", TaskSchema);

export default TaskModel;