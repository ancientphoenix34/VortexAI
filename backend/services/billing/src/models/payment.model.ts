import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  orderId: string;
  paymentId?: string;
  amount?: number;
  currency: string;
  credits?: number;
  plan?: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    credits: {
      type: Number,
    },
    plan: {
      type: String,
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
  },
  {
    timestamps: true,
  }
);

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
