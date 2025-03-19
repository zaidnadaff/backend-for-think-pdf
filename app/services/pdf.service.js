import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs";

const processPDF = async (filePath, fileName, userId) => {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  const text = getPDFText(docs);
  console.log(text);
  fs.rmSync(filePath);
  return true;
};

const getPDFText = (docs) => {
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

export { processPDF };
