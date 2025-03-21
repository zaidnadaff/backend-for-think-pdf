import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { initializeEmbeddingsModel } from "../config/gemini.config.js";
import { initializePinecone } from "../config/pinecone.config.js";
import { saveDocument } from "./document.service.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const processPDF = async (filePath, fileName, userId) => {
  try {
    if (!filePath || !fileName || !userId) {
      throw new Error("Invalid processing parameters");
    }
    const docuemntId = uuidv4();

    const rawText = await getPDFText(filePath);
    const textChunks = await generateChunks(rawText);
    await storeDocumentinPinecone(textChunks, docuemntId, userId);

    // const { isDocumentSaved, documentMessage } = await saveDocument(
    //   userId,
    //   docuemntId,
    //   fileName
    // );
    // if (!isDocumentSaved) {
    //   throw new Error(documentMessage);
    // }

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
  const embeddingsModel = initializeEmbeddingsModel();
  const pineconeIndex = pc.index("pdf-index");
  const documents = textChunks.map((chunk, index) => ({
    PageContent: chunk,
    Metadata: {
      documentId: documentId,
      userId: userId,
      chunkIndex: index,
    },
  }));
  const vectorStore = await PineconeStore.fromExistingIndex(
    documents,
    embeddingsModel,
    {
      index: pineconeIndex,
      namespace: "ab-5c",
    }
  );
  console.log(vectorStore);
};

export { processPDF };
