import mongoose, { Schema, model, Document } from 'mongoose';

export interface Bounty {
    issueId: string;
    ownerId: mongoose.Types.ObjectId;
    assignees: mongoose.Types.ObjectId[];
    description: string;
    title: string;
    repositoryId: mongoose.Types.ObjectId;
    bountyAmount: number; // Added bountyAmount field
    status?:"pending" | "completed"
}

export interface IBounty extends Document, Bounty {}

const BountySchema = new Schema<IBounty>({
    issueId: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    assignees: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    description: {
        type: String,
        required: true 
    },
    title: { 
        type: String,
        required: true
    },
    repositoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Repository',
        required: true
    },
    bountyAmount: {
        type: Number,
        required: true // Added bountyAmount field
    },
    status:{
        type:String,
        enum:["pending","completed"],
        required:false,
        default:"pending"
    }
}, {
    timestamps: true
});

const Bounty = mongoose.models.Bounty || model<IBounty>('Bounty', BountySchema);

export default Bounty;
