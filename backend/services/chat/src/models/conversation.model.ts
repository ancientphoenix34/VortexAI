import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    title: {
      type: String,
      default: 'New Chat',
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  'Conversation',
  conversationSchema
);

export default Conversation;
