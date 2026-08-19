import axios from 'axios';

export const getMessages = async (conversationId: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE}/get-messages/${conversationId}`
    );
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return null;
  }
};

export default getMessages;
