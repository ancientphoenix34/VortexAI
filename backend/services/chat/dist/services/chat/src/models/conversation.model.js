import mongoose, { Schema } from 'mongoose';
const conversationSchema = new Schema({
    title: {
        type: String,
        default: 'New Chat',
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
