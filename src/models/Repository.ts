import mongoose, { Schema, Document } from 'mongoose';

// Define the Repository interface
export interface Repository {
    name: string;
    full_name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    owner_id:mongoose.Types.ObjectId
}

// Extend the interface for Mongoose's Document
export interface IRepositoryModel extends Repository, Document { }

// Define the schema for the Repository
const RepositorySchema: Schema = new Schema({
    id: { type: Number, required: false, unique: false },
    owner_id:{type:mongoose.Schema.ObjectId,required:true,ref:'User'},
    name: { type: String, required: true },
    full_name: { type: String, required: true },
    description: { type: String, required: false },
    language: { type: String, required: false },
    stargazers_count: { type: Number, required: true, default: 0 },
    forks_count: { type: Number, required: true, default: 0 },
    watchers_count: { type: Number, required: true, default: 0 },
});

// Singleton model implementation
let Repository: mongoose.Model<IRepositoryModel>;

if (mongoose.models.Repository) {
    Repository = mongoose.models.Repository;
} else {
    Repository = mongoose.model<IRepositoryModel>('Repository', RepositorySchema);
}

export default Repository;
