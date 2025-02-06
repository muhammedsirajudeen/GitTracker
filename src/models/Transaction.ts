import { UserWithId } from "@/app/api/auth/github/route"
import mongoose, { model, mongo, ObjectId, Schema, Types } from "mongoose"

export interface Transaction{
    _id:string
    id:string
    fromAddress:string
    toAddress:string
    amount:number
    date:Date
    userId:string
}

export interface PopulatedTransaction extends Omit<Transaction,"userId">{
    userId:UserWithId
}

export interface ITransaction extends Omit<Transaction,"id"|"_id"|"userId">,Document{
    userId:ObjectId
}

const transactionSchema = new Schema<ITransaction>(
    {
      fromAddress: {
        type: String,
        required: true,
        trim: true,
      },
      toAddress: {
        type: String,
        required: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );



const TransactionModel = mongoose.models.Transaction|| model<ITransaction>("Transaction", transactionSchema);

export default TransactionModel;