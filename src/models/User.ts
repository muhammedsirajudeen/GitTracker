import mongoose, { Schema, Document, Model } from 'mongoose';

export interface User {
  email: string;
  password: string;
  verified: boolean;
  avatar_url: string;
  wallet_status: boolean;
  wallet_address:string | null;
  role:"admin" | "user"
}
export interface IUser extends User, Document {}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Email must be at least 3 characters long'],
      maxlength: [50, 'Email must not exceed 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    avatar_url: {
      type: String,
      required: false,
    },
    wallet_status: {
      type: Boolean,
      required: false,
      default: false,
    },
    wallet_address:{
      type:String,
      required:false,
      default:null
    },
    role:{
        type:String,
        enum:['admin','user'],
        required:false,
        default:'user',
    }  
  },
  { timestamps: true }
);

// Singleton pattern to ensure a single instance of the model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
