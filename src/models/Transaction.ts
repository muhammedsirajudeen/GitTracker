import { UserWithId } from "@/app/api/auth/github/route"
import mongoose, { model, ObjectId, Schema, Types } from "mongoose"

export interface Transaction{
    _id:string
    id:string
    fromAddress:string
    toAddress:string
    amount:number
    date:Date
    userId:string
    recieverId?:string
}

export interface PopulatedTransaction extends Omit<Transaction,"userId"|"recieverId">{
    userId:UserWithId
    recieverId?:UserWithId
}

export interface ITransaction extends Omit<Transaction,"id"|"_id"|"userId"|"recieverId">,Document{
    userId:ObjectId
    recieverId?:ObjectId
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
      recieverId:{
        type:Types.ObjectId,
        ref:"User",
        required:false,
        default:null
      }
    },
    {
      timestamps: true,
    }
  );



const TransactionModel = mongoose.models.Transaction|| model<ITransaction>("Transaction", transactionSchema);

export default TransactionModel;