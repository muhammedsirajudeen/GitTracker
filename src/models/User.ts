import mongoose, { Schema, Document, Model } from 'mongoose';

export interface User {
  email: string;
  password: string;
  verified:boolean
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
    verified:{
      type:Boolean,
      required:false,
      default:false
    }
  },
  { timestamps: true }
);

// Singleton pattern to ensure a single instance of the model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
