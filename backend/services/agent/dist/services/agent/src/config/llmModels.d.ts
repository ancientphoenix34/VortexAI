import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
export declare const getModel: (agent: string) => ChatAnthropic | ChatOpenAI<import("@langchain/openai").ChatOpenAICallOptions>;
