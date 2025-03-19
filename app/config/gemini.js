import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";

let genAI = null;
let model = null;

const api_key = process.env.GOOGLE_API_KEY;

function initializeGeminiModel() {
  console.log("Initializing geni ai model");
  genAI = new GoogleGenerativeAI(api_key);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  console.log("Model initialized");
  return true;
}

functi;
