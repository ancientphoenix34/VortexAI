import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';
import { deductCredit } from '../utils/deductCredit.js';
import { checkAgentLimit } from '../config/agentLimit.js';

function extractJson(text: string): string {
  let trimmed = text.trim();

  // Strip a ```json ... ``` or ``` ... ``` wrapper if present
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) {
    trimmed = fenceMatch[1].trim();
  }

  // Fallback: grab from the first { to the last } in case of stray text
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    trimmed = trimmed.slice(start, end + 1);
  }

  return trimmed;
}

export const codingAgent = async (state: typeof agentState.State) => {
  try {
    await checkAgentLimit(state.userId, 'coding');
    const llm = await getModel("coding");
    const intentLLM = await getModel("intent");

    const intentRes = await intentLLM.invoke(`You are an intent classifier.

Return ONLY one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}`);

    const intent = intentRes.content;

    if (intent == "CODE_GENERATION") {
      const prompt = `You are CortexAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:

- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

Return ONLY valid JSON.

Schema:

{
  "files":[
    {
      "name":"index.html",
      "content":"..."
    },
    {
      "name":"style.css",
      "content":"..."
    },
    {
      "name":"script.js",
      "content":"..."
    }
  ]
}

Rules:

- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:
${state.prompt}`;

      const res = await llm.invoke(prompt);
      const content = JSON.parse(extractJson(res.content as string));

      await deductCredit(state.userId, 'coding');

      return {
        ...state,
        aiResponse: "Code generated successfully",
        artifacts: [{
          id: Date.now(),
          type: "Project",
          files: content.files || [],
          title: state.prompt
        }]
      };
    }

    const res = await llm.invoke(`The user's request is:

${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}`);

    const data = res.content;

    await deductCredit(state.userId, 'coding');

    return {
      ...state,
      aiResponse: data,
      artifacts: []
    };
  } catch (error: any) {
    console.error('Error in codingAgent:', error);
    if (error?.data?.message) {
      return {
        ...state,
        aiResponse: error.data.message,
      };
    }
    throw error;
  }
};
