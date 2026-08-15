import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';

export const chatAgent = async (state: typeof agentState.State) => {
  try {
    const llm = getModel("chat");

    const systemPrompt = "You are Cortex AI, an intelligent AI assistant.";

    const response = await llm.invoke([
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'human',
        content: state.prompt,
      },
    ]);

    return {
      ...state,
      aiResponse: typeof response.content === 'string' ? response.content : JSON.stringify(response.content),
    };
  } catch (error) {
    console.error('Error in chatAgent:', error);
    throw error;
  }
};

