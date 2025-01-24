import { Schema, model, Document, Types } from 'mongoose';
import { Bounty } from './Bounty';
import { User } from '@/lib/types';

// Define the interface for TypeScript type checking
export interface BountyRedemption{
    _id: string;
    repofullname:string
    pullrequestnumber: number;
    bountyId: Types.ObjectId
    applicantId: Types.ObjectId
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PopulatedBountyRedemption extends Omit<BountyRedemption,"bountyId"|"applicantId">{
    bountyId: Bounty
    applicantId: User
}

export interface IBountyRedemption extends Omit<BountyRedemption,"_id"|"bountyId"|"applicantId">,Document{
    bountyId:Types.ObjectId
    applicantId:Types.ObjectId
}

// Define the Mongoose schema
const BountyRedemptionSchema = new Schema<IBountyRedemption>(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
        },
        bountyId: {
            type: Schema.Types.ObjectId,
            ref: 'Bounty',
            required: true,
        },
        applicantId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        pullrequestnumber:{
            type: Number,
            required: true,
        },
        repofullname:{
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Create the model
const BountyRedemption = model<IBountyRedemption>(
    'BountyRedemption',
    BountyRedemptionSchema
);

export default BountyRedemption;
