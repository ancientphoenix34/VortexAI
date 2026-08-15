import { agentState } from './state.js';
export declare const router: (state: typeof agentState.State) => Promise<{
    prompt: string;
    aiResponse: string;
    agent: string;
}>;
