import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
    prompt: Annotation<string>(),
    aiResponse: Annotation<string>(),
    agent: Annotation<string>(),
    conversationId: Annotation<string>(),
    searchResults: Annotation<any>(),
    images: Annotation<any>(),
    artifacts: Annotation<any>(),
});