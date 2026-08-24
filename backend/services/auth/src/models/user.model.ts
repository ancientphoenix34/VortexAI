import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  name?: string;
  email?: string;
  avatar?: string;
  plan?: string;
  credits?: number;
  totalCredits?: number;
  planExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    avatar: {
      type: String,
    },
    plan: {
      type: String,
      default:"free"
    },
    credits: {
      type: Number,
      default:100
    },
    totalCredits: {
     type: Number,
      default:100
    },
    planExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
