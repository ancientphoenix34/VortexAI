import { QdrantVectorStore } from "@langchain/qdrant"
import { embeddings } from "./embeddings.js";
import dotenv from "dotenv";

dotenv.config();

export const vectorStore = async (docs: any, collectionName: string) => {
  const config = {
    url: process.env.QDRANT_URL,
    collectionName: collectionName,
  };

  if (docs && Array.isArray(docs) && docs.length > 0) {
    return QdrantVectorStore.fromDocuments(docs, embeddings, config);
  }

  return QdrantVectorStore.fromExistingCollection(embeddings, config);
};