import { Request, Response } from 'express';
import axios from 'axios';
import { graph } from '../graph/graph.js';
import { addMessages } from '../config/memory.js';

export const Agent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, conversationId, agent } = req.body;

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: 'user',
      content: prompt,
    });

    const result = await graph.invoke({ prompt, conversationId, agent });

    const response = result.aiResponse;
    const images = result.images;
    const artifacts = result.artifacts;
    
    await addMessages(conversationId, 'user', prompt);
    await addMessages(conversationId, 'assistant', response);

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: 'assistant',
      content: response,
      images,
      artifacts,
    });
    res.status(200).json({ response, images, artifacts });
  } catch (error: any) {
    console.error('Error in Agent controller:', error);
    res.status(500).json({
      message: 'Failed to process agent request',
      error: error.message || error,
    });
  }
};
