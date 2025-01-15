import  mongoose, { Schema, model, Document } from 'mongoose';

export interface BountyApplication {
    bountyId: mongoose.Types.ObjectId;
    applicantId: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt?: Date;
}

export interface IBountyApplication extends Document, BountyApplication {}

const BountyApplicationSchema = new Schema<IBountyApplication>({
    bountyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bounty',
        required: true
    },
    applicantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now,
        required: false
    }
}, {
    timestamps: true
});

const BountyApplication = mongoose.models.BountyApplication ||  model<IBountyApplication>('BountyApplication', BountyApplicationSchema);

export default BountyApplication;