import mongoose, { Document, Model } from 'mongoose';
export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Message: Model<IMessage>;
export default Message;
