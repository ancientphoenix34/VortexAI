import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { agentState } from '../graph/state.js';
import { getModel } from '../config/llmModels.js';
import { vectorStore } from '../config/vectorDb.js';
import { deductCredit } from '../utils/deductCredit.js';

export const pdfRagAgent = async (state: typeof agentState.State) => {
  try {
    const buffer = fs.readFileSync(state.file.path);
    const pdf = new PDFParse({ data: buffer });
    const result = await pdf.getText();
    const text = result.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);

    const collectionName = `pdf-${Date.now()}`;

    const store = await vectorStore(docs, collectionName);

    const relevantDocs = await store.similaritySearch(state.prompt, 5);

    const context = relevantDocs.map((d: any) => d.pageContent).join('\n\n');

    const llm = await getModel('pdf-rag');

    const messages = [
      new SystemMessage(`You are CortexAI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:

"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.
`),
      new HumanMessage(`Context: ${context}\n\nQuestion: ${state.prompt}`),
    ];

    const response = await llm.invoke(messages);

    await deductCredit(state.userId, 'pdf-rag');

    return {
      ...state,
      aiResponse: typeof response.content === 'string' ? response.content : String(response.content),
    };
  } catch (error) {
    console.error('Error in pdfRagAgent:', error);
    return {
      ...state,
      aiResponse: 'Failed to analyze PDF.',
    };
  } finally {
    if (state.file?.path && fs.existsSync(state.file.path)) {
      try {
        fs.unlinkSync(state.file.path);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }
    }
  }
};
