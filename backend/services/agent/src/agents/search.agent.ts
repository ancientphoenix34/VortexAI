import { agentState } from '../graph/state.js';
import { searchTool } from '../config/tavily.js';
import { deductCredit } from '../utils/deductCredit.js';
import { checkAgentLimit } from '../config/agentLimit.js';

export const searchAgent = async (state: typeof agentState.State) => {
  try {
    await checkAgentLimit(state.userId, 'search');
    const results: any = await searchTool().invoke({
      query: state.prompt,
    });

    await deductCredit(state.userId, 'search');

    return {
      ...state,
      searchResults: results,
      images: results?.images || [],
    };
  } catch (error: any) {
    console.error('Error in searchAgent:', error);
    if (error?.data?.message) {
      return {
        ...state,
        aiResponse: error.data.message,
        searchResults: [],
        images: [],
      };
    }
  }
};
