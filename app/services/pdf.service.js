import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { initializeEmbeddingsModel } from "../config/gemini.config.js";
import {
  getPineconeIndex,
  initializePinecone,
} from "../config/pinecone.config.js";
import { saveDocument } from "./document.service.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const processPDF = async (filePath, fileName, userId) => {
  try {
    if (!filePath || !fileName || !userId) {
      throw new Error("Invalid processing parameters");
    }

    const documentId = uuidv4();
    // const rawText = await getPDFText(filePath);
    // const textChunks = await generateChunks(rawText);
    // await storeDocumentInPinecone(textChunks, documentId, userId);

    const docResponse = await saveDocument(userId, documentId, fileName);

    if (!docResponse.success) {
      console.log(isDocumentSaved, documentMessage);
      console.log("throwing an error");
      throw new Error(docResponse.message);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return { documentId, message: "Document Loaded Successfully!" };
  } catch (err) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { documentId: null, message: err.message };
  }
};

const getPDFText = async (filePath) => {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  let text = "";
  for (const doc of docs) {
    text += doc.pageContent;
  }
  return text;
};

const generateChunks = async (text) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitText(text);
  console.log(`Created ${chunks.length} text chunks`);
  return chunks;
};

const storeDocumentInPinecone = async (textChunks, documentId, userId) => {
  try {
    const pinecone = await initializePinecone();
    const embeddingsModel = initializeEmbeddingsModel();
    const pineconeIndex = await getPineconeIndex(pinecone);

    const documents = textChunks.map((chunk, i) => ({
      pageContent: chunk,
      metadata: {
        documentId,
        userId,
        chunkIndex: i,
      },
    }));

    await PineconeStore.fromDocuments(documents, embeddingsModel, {
      pineconeIndex,
      namespace: documentId,
      textKey: "pageContent",
    });

    console.log(
      `Stored ${documents.length} embeddings in Pinecone for document ${documentId}`
    );
    return true;
  } catch (error) {
    console.error("Error storing document in Pinecone:", error);
    throw new Error(
      `Failed to store document in vector database: ${error.message}`
    );
  }
};

export { processPDF };
