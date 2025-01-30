import mongoose, { Schema, Document } from "mongoose";

// Enum for task priority
enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}
export interface Task {
    _id: string;
    ownerId: string;
    repositoryId: string;
    taskTitle: string;
    issueId: string;
    description: string;
    priority: Priority;

}

export interface ITask extends Omit<Task, "_id" | "ownerId" | "repositoryId" | "issueId">, Document {
    ownerId: mongoose.Types.ObjectId;
    repositoryId: mongoose.Types.ObjectId;
    issueId: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema<ITask>(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        repositoryId: {
            type: Schema.Types.ObjectId,
            ref: "Repository",
            required: true,
        },
        taskTitle: {
            type: String,
            required: true,
            trim: true,
        },
        issueId: {
            type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt timestamps
    }
);

export default mongoose.model<ITask>("Task", TaskSchema);
