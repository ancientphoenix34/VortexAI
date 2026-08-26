import axios from 'axios';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';
import { uploadToS3 } from '../utils/uploadToS3.js';
import { getFromS3 } from '../utils/getFromS3.js';
import { deductCredit } from '../utils/deductCredit.js';

export const visionAgent = async (state: typeof agentState.State) => {
  try {
    const llm = await getModel("vision");

    const res = await llm.invoke([
      new SystemMessage(
        `You are an expert AI image prompt engineer. Your job is to convert the user's request into a vivid, highly descriptive image prompt optimized for text-to-image AI models (such as Flux / SDXL).

RULES:
1. ALWAYS place the main subject and exact action first (e.g., "A golden retriever dog wearing sunglasses sitting behind the steering wheel of a red convertible car driving on a coastal road" or "A detailed macro photography shot of a tiny worker ant carrying a large cubic block of white sugar on its back").
2. Clearly describe the subject, key actions, interaction between objects, background environment, camera perspective, and lighting in 2 to 3 vivid sentences.
3. Do NOT flood the prompt with repetitive generic buzzwords. Focus on clear, specific visual descriptions.
4. Output ONLY the raw expanded prompt text. Do NOT include quotes, preambles, or markdown formatting.`
      ),
      new HumanMessage(`User Request: ${state.prompt}`),
    ]);

    const prompt = (res.content as string).trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const buffer = Buffer.from(imageRes.data);
    const fileName = `image-${Date.now()}.png`;

    await uploadToS3(fileName, buffer, "image/png");

    const downloadUrl = await getFromS3(fileName, 24 * 60);

    await deductCredit(state.userId, 'vision');

    return {
      ...state,
      aiResponse: `# 🖼️ Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.`
    };
  } catch (error) {
    console.error('Error in visionAgent:', error);
    return {
      ...state,
      aiResponse: "❌ Failed to generate image."
    };
  }
};
