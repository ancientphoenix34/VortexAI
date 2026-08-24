import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';
import { generatePPT } from '../utils/generatePpt.js';
import { getFromS3 } from '../utils/getFromS3.js';
import { uploadToS3 } from '../utils/uploadToS3.js';

export const pptAgent = async (state: typeof agentState.State) => {
  try {
    const llm = await getModel("ppt");

    const prompt = `You are a professional presentation designer.

Format:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:

${state.prompt}`;

    const res = await llm.invoke(prompt);

    const rawContent = typeof res.content === 'string'
      ? res.content
      : Array.isArray(res.content)
        ? res.content.map((block: any) => block.text || '').join('')
        : String(res.content);

    const cleanedContent = rawContent.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
    const data = JSON.parse(cleanedContent);

    const ppt = await generatePPT(data);
    const buffer = (await ppt.write({ outputType: 'nodebuffer' })) as Buffer;

    const fileName = `ppt-${Date.now()}.pptx`;
    await uploadToS3(
      fileName,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    const downloadUrl = await getFromS3(fileName, 24 * 60);

    return {
      ...state,
      aiResponse: `# Presentation Generated

${data?.title ? `**${data.title}**\n\n` : ''}📥 [Download Presentation](${downloadUrl})

*⏳ Link expires in 24 hours.*`
    };
  } catch (error) {
    console.error('Error in pptAgent:', error);
    return {
      ...state,
      aiResponse: "Sorry! Couldn't generate PPT at the moment."
    };
  }
};
