import { Request, Response } from 'express';
import axios from 'axios';
import { graph } from '../graph/graph.js';

export const Agent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, conversationId } = req.body;

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: 'user',
      content: prompt,
    });

    const result = await graph.invoke({ prompt, conversationId });

    const response = result.aiResponse;
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: 'assistant',
      content: response,
    });
    res.status(200).json({ response });
  } catch (error: any) {
    console.error('Error in Agent controller:', error);
    res.status(500).json({
      message: 'Failed to process agent request',
      error: error.message || error,
    });
  }
};
