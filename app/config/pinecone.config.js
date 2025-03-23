import "dotenv/config";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const initializePinecone = async () => {
  const pinecone = new PineconeClient();
  return pinecone;
};

const getPineconeIndex = async (pinecone) => {
  const indexName = process.env.PINECONE_INDEX;
  const index = pinecone.index(indexName);
  return index;
};

export { initializePinecone, getPineconeIndex };
