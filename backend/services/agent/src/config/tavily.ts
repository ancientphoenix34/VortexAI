import { TavilySearch } from "@langchain/tavily";

export const searchTool = () => {
  return new TavilySearch({
    maxResults: 5,
    topic: "general",
    includeImages: true,
  });
};
