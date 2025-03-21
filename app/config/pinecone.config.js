import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

const apiKey = process.env.PINECONE_API_KEY;

const initializePinecone = async () => {
  const pc = new Pinecone({
    apiKey: apiKey,
  });

  const indexName = "pdf-index";

  // await pc.createIndex({
  //   name: indexName,

  //   dimension: 768,
  //   metric: "cosine",

  //   spec: {
  //     serverless: {
  //       cloud: "aws",

  //       region: "us-east-1",
  //     },
  //   },
  // });
  return pc;
};

export { initializePinecone };
