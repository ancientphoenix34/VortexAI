import { agentState } from './state.js';
import { getModel } from '../config/llmModels.js';

export const router = async (state: typeof agentState.State) => {
    try {
        if (state.agent && state.agent.toLowerCase() !== 'auto') {
            return {
                ...state,
                agent: state.agent.toLowerCase(),
            };
        }

        const llm = getModel("router");

        const prompt = `You are an agent router.

Available agents:
- chat: General conversation, explanations, learning, questions.
- search: Current events, latest information, news, recent developments, internet lookup.
- coding: Generate code, debug code, build projects, architecture, API design.
- vision: Generate image, create image, draw image, generate picture, image requests.
- pdf: Questions about generate PDFs or document context.
- ppt: Questions about generate ppts or ppt context.

Return ONLY one word from this list:
chat
search
coding
vision
pdf
ppt

User Query: ${state.prompt}`;

        const response = await llm.invoke(prompt);

        return {
            ...state,
            agent: (response.content as string).trim().toLowerCase(),
        };
    } catch (error) {
        console.error('Error in router:', error);
        throw error;
    }
};
