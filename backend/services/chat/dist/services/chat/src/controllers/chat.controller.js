import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
export const createConversation = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            res.status(400).json({ message: 'User ID is required in headers (x-user-id)' });
            return;
        }
        const conversation = await Conversation.create({
            userId,
        });
        res.status(200).json(conversation);
    }
    catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({
            message: 'Failed to create conversation',
            error: error.message || error,
        });
    }
};
export const getConversation = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            res.status(400).json({ message: 'User ID is required in headers (x-user-id)' });
            return;
        }
        const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            message: 'Failed to fetch conversations',
            error: error.message || error,
        });
    }
};
export const getConversations = getConversation;
export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id, { title });
        res.status(200).json(conversation);
    }
    catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({
            message: 'Failed to update conversation',
            error: error.message || error,
        });
    }
};
export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body;
        const message = await Message.create({
            conversationId,
            role,
            content,
        });
        res.status(200).json(message);
    }
    catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({
            message: 'Failed to save message',
            error: error.message || error,
        });
    }
};
export const getMessages = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        if (!conversationId) {
            res.status(400).json({ message: 'Conversation ID is required' });
            return;
        }
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            message: 'Failed to fetch messages',
            error: error.message || error,
        });
    }
};
