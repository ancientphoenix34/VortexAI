import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';
import { getMemory } from '../config/memory.js';
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { deductCredit } from '../utils/deductCredit.js';

export const chatAgent = async (state: typeof agentState.State) => {
  try {
    const llm = getModel("chat");

    const searchContext = state.searchResults
      ? `\n\n${JSON.stringify(state.searchResults)}\nAnswer the user using the above search results:`
      : '';

    const systemPrompt = ` You are Vortex AI, an intelligent AI assistant.
    
    ${searchContext}
If searchContext exists:

- Use search results to answer.
- Do not mention any internal tools.


Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.`;

    const history = await getMemory(state.conversationId);

    const messages: BaseMessage[] = [new SystemMessage(systemPrompt)];

    history.forEach((msg: { role: string; content: string }) => {
      if (msg.role === 'user') {
        messages.push(new HumanMessage(msg.content));
      }
      if (msg.role === 'assistant') {
        messages.push(new AIMessage(msg.content));
      }
    });

    messages.push(new HumanMessage(state.prompt));

    const response = await llm.invoke(messages);

    await deductCredit(state.userId, 'chat');

    return {
      ...state,
      aiResponse: typeof response.content === 'string' ? response.content : JSON.stringify(response.content),
    };
  } catch (error) {
    console.error('Error in chatAgent:', error);
    throw error;
  }
};
