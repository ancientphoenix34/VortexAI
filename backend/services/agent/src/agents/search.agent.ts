import { agentState } from '../graph/state.js';
import { searchTool } from '../config/tavily.js';
import { deductCredit } from '../utils/deductCredit.js';

export const searchAgent = async (state: typeof agentState.State) => {
  try {
    const results: any = await searchTool().invoke({
      query: state.prompt,
    });

    await deductCredit(state.userId, 'search');

    return {
      ...state,
      searchResults: results,
      images: results?.images || [],
    };
  } catch (error) {
    console.error('Error in searchAgent:', error);
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
