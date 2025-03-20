import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { initializeEmbeddingsModel } from "../config/gemini.config.js";
import { initializePinecone } from "../config/pinecone.config.js";
import { saveDocument } from "./document.service.js";

import fs from "fs";

const processPDF = async (filePath, fileName, userId) => {
  try {
    const docuemntId = uuidv4();

    const rawText = getPDFText(filePath);
    const textChunks = generateChunks(rawText);
    await storeDocumentinPinecone(textChunks, docuemntId, userId);

    const { isDocumentSaved, documentMessage } = await saveDocument(
      userId,
      docuemntId,
      fileName
    );
    if (!isDocumentSaved) {
      throw new Error(documentMessage);
    }

    return { documentId: docuemntId, message: "Document Loaded Successfully!" };
  } catch (err) {
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

const storeDocumentinPinecone = async (textChunks, documentId, userId) => {
  const pc = await initializePinecone();
  const embeddingsModel = await initializeEmbeddingsModel();
  const index = pc.index;
  const documents = textChunks.map((chunk, index) => ({
    PageContent: chunk,
    Metadata: {
      documentId: documentId,
      userId: userId,
      chunkIndex: index,
    },
  }));
  const vectorStore = PineconeStore.fromExistingIndex(
    documents,
    embeddingsModel,
    {
      index,
      namespace: documentId,
    }
  );
};

export { processPDF };
