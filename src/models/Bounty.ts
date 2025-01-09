import { Schema, model, Document } from 'mongoose';

interface Bounty {
    issueId: string;
    ownerId: Schema.Types.ObjectId;
    assignees: Schema.Types.ObjectId[];
    description: string;
    title: string;
    repositoryId: Schema.Types.ObjectId;
    bountyAmount: number; // Added bountyAmount field
}

interface IBounty extends Document, Bounty {}

const BountySchema = new Schema<IBounty>({
    issueId: {
        type: String,
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
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
    }
}, {
    timestamps: true
});

const Bounty = model<IBounty>('Bounty', BountySchema);

export default Bounty;
