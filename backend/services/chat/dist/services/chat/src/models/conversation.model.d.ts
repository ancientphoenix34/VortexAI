import { Document, Model } from 'mongoose';
export interface IConversation extends Document {
    title: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Conversation: Model<IConversation>;
export default Conversation;
