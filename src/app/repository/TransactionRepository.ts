import { Model, Types } from "mongoose";
import BaseRepository from "./BaseRepository";
import TransactionModel, { ITransaction } from "@/models/Transaction";

export interface ITransactionRepository {
    create(transactionData: Partial<ITransaction>): Promise<ITransaction>;
    getById(transactionId: string): Promise<ITransaction | null>;
    getAll(page:number): Promise<ITransaction[]>;
    updateById(
        transactionId: string,
        updateData: Partial<ITransaction>
    ): Promise<ITransaction | null>;
    deleteById(transactionId: string): Promise<ITransaction | null>;
    findByUserId(userId: string,page:number): Promise<ITransaction[]>;
}


class TransactionRepository extends BaseRepository implements ITransactionRepository {
    private _TransactionModel: Model<ITransaction>;

    constructor(TransactionModel: Model<ITransaction>) {
        super();
        this._TransactionModel = TransactionModel;
    }

    // Create a new transaction
    async create(transactionData: Partial<ITransaction>): Promise<ITransaction> {
        const transaction = new this._TransactionModel(transactionData);
        return await transaction.save();
    }

    // Get a transaction by ID
    async getById(transactionId: string): Promise<ITransaction | null> {
        return await this._TransactionModel.findById(transactionId).exec();
    }

    // Get all transactions
    async getAll(page:number): Promise<ITransaction[]> {
        return await this._TransactionModel.find().limit(this.PAGE_LIMIT).skip(this.PAGE_LIMIT*page).populate(
            [
                {
                    path:'userId',
                    select:'email avatar_url'
                }
            ]
        ).exec();
    }

    // Update a transaction by ID
    async updateById(
        transactionId: string,
        updateData: Partial<ITransaction>
    ): Promise<ITransaction | null> {
        return await this._TransactionModel.findByIdAndUpdate(
            transactionId,
            { $set: updateData },
            { new: true }
        ).exec();
    }

    // Delete a transaction by ID
    async deleteById(transactionId: string): Promise<ITransaction | null> {
        return await this._TransactionModel.findByIdAndDelete(transactionId).exec();
    }

    // Find transactions by userId
    async findByUserId(userId: string,page:number): Promise<ITransaction[]> {
        return await this._TransactionModel.find({ userId: new Types.ObjectId(userId) }).limit(this.PAGE_LIMIT).skip(this.PAGE_LIMIT*page).exec();
    }
}

const TransactionRepositoryInstance = new TransactionRepository(TransactionModel)
export default TransactionRepositoryInstance