import { StateGraph, START, END } from '@langchain/langgraph';
import { agentState } from './state.js';
import { router } from './router.js';
import { chatAgent } from '../agents/chat.agent.js';
import { searchAgent } from '../agents/search.agent.js';
import { codingAgent } from '../agents/coding.agent.js';
import { pdfAgent } from '../agents/pdf.agent.js';
import { pptAgent } from '../agents/ppt.agent.js';
import { visionAgent } from '../agents/vision.agent.js';
import { pdfRagAgent } from '../agents/pdf-rag.agent.js';
import { imageAnalyzerAgent } from '../agents/image-analyzer.agent.js';

export const workflow = new StateGraph(agentState)
  .addNode('router', router)
  .addNode('chat', chatAgent)
  .addNode('search', searchAgent)
  .addNode('coding', codingAgent)
  .addNode('pdf', pdfAgent)
  .addNode('ppt', pptAgent)
  .addNode('vision', visionAgent)
  .addNode('pdf-rag', pdfRagAgent)
  .addNode('image-analyzer', imageAnalyzerAgent)

  .addEdge(START, 'router')
  .addConditionalEdges('router', (state: typeof agentState.State) => {
    switch(state.agent){
        case 'chat':
            return 'chat';
        case 'search':
            return 'search';
        case 'coding':
            return 'coding';
        case 'pdf':
            return 'pdf';
        case 'ppt':
            return 'ppt';
        case 'vision':
            return 'vision';
        case 'pdf-rag':
            return 'pdf-rag';
        case 'image-analyzer':
            return 'image-analyzer';
        default:
            return 'chat';
    }
  }, ["chat", "search", "coding", "pdf", "ppt", "vision", "pdf-rag", "image-analyzer"])
  .addEdge("search", "chat")
  .addEdge("chat", END)
  .addEdge("coding",END)    
  .addEdge("pdf",END)
  .addEdge("ppt",END)
  .addEdge("vision",END)
  .addEdge("pdf-rag",END)
  .addEdge("image-analyzer",END);

export const graph = workflow.compile();
