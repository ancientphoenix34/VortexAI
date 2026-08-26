import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

let openAI: ChatOpenAI | null = null;
let anthropic: ChatAnthropic | null = null;

const getOpenAI = () => {
  if (!openAI) {
    openAI = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openAI;
};

const getAnthropic = () => {
  if (!anthropic) {
    anthropic = new ChatAnthropic({
      model: "claude-haiku-4-5",
      temperature: 0.3,
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
};

export const getModel = (agent: string) => {
  switch (agent) {
    case "chat":
      return getOpenAI();
    case "search":
      return getOpenAI();
    case "coding":
      return getAnthropic();
    case "vision":
      return getOpenAI();
    case "ppt":
      return getAnthropic();
    case "pdf":
      return getAnthropic();
    case "image-analyzer":
      return getOpenAI();
    default:
      return getOpenAI();
  }
};




