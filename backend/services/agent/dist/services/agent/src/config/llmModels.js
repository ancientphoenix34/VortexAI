import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
const openAI = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
});
const anthropic = new ChatAnthropic({
    model: "claude-3-5-sonnet-latest",
    temperature: 0.3,
    apiKey: process.env.ANTHROPIC_API_KEY,
});
export const getModel = (agent) => {
    switch (agent) {
        case "chat":
            return openAI;
        case "search":
            return openAI;
        case "coding":
            return anthropic;
        case "vision":
            return openAI;
        case "ppt":
            return anthropic;
        case "pdf":
            return anthropic;
        default:
            return openAI;
    }
};
