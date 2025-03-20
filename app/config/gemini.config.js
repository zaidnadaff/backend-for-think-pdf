import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";

let genAI = null;
let model = null;

const apiKey = process.env.GOOGLE_API_KEY;

function initializeGeminiModel() {
  console.log("Initializing geni ai model");
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  console.log("Model initialized");
  return true;
}

function initializeEmbeddingsModel() {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: apiKey,
    model: "models/text-embedding-004",
  });
}

function getModel() {
  return model;
}
export { initializeGeminiModel, getModel, initializeEmbeddingsModel };
