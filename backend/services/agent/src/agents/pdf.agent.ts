import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';
import { generatePdf } from '../utils/generatePdf.js';
import { getFromS3 } from '../utils/getFromS3.js';
import { uploadToS3 } from '../utils/uploadToS3.js';
import { deductCredit } from '../utils/deductCredit.js';

export const pdfAgent = async (state: typeof agentState.State) => {
  try {
    const llm = await getModel("pdf");

    const prompt = `You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

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
    const pdfBuffer: Buffer = await generatePdf(data);
    
    const fileName = `pdf-${Date.now()}.pdf`;
    await uploadToS3(fileName, pdfBuffer, "application/pdf");

    const downloadUrl = await getFromS3(fileName, 24 * 60);

    await deductCredit(state.userId, 'pdf');

    return {
      ...state,
      aiResponse: `# PDF Generated

${data?.title ? `**${data.title}**\n\n` : ''}📥 [Download PDF](${downloadUrl})

*⏳ Link expires in 24 hours.*`
    };
  } catch (error) {
    console.error('Error in pdfAgent:', error);
    return {
      ...state,
      aiResponse: "Sorry! Couldn't generate PDF at the moment."
    };
  }
};



