import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import fs from 'fs';
import { deductCredit } from '../utils/deductCredit.js';

export const imageAnalyzerAgent = async (state: typeof agentState.State) => {
  try {
    const llm = getModel('image-analyzer');

    const imageBuffer = await fs.promises.readFile(state.file.path);
    const base64Image = imageBuffer.toString('base64');

    const messages = [
      new SystemMessage(
        `You are VortexAI image analyzer Agent.

Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate.`
      ),
      new HumanMessage({
        content: [
          {
            type: 'text',
            text: state.prompt || 'Analyze this image',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const response = await llm.invoke(messages);

    await deductCredit(state.userId, 'image-analyzer');

    return {
      ...state,
      aiResponse: response.content as string,
    };
  } catch (error) {
    console.error('Error in imageAnalyzerAgent:', error);
    return {
      ...state,
      aiResponse: 'Failed to analyze the file',
    };
  } finally {
    if (state.file?.path && fs.existsSync(state.file.path)) {
      try {
        await fs.unlinkSync(state.file.path);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }
    }
  }
};

