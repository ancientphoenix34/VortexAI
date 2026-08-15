import { agentState } from '../graph/state.js';
export declare const chatAgent: (state: typeof agentState.State) => Promise<{
    prompt: string;
    agent: string;
    aiResponse: string;
}>;
