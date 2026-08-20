import { agentState } from '../graph/state.js';
import { searchTool } from '../config/tavily.js';

export const searchAgent = async (state: typeof agentState.State) => {
  try {
    const results: any = await searchTool().invoke({
      query: state.prompt,
    });

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
