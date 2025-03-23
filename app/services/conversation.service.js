import { Conversation } from "../models/conversation.model.js";
import {
  getPineconeIndex,
  initializePinecone,
} from "../config/pinecone.config.js";
import { initializeEmbeddingsModel } from "../config/gemini.config.js";
import { PineconeStore } from "@langchain/pinecone";
import { initializeGeminiModel } from "../config/gemini.config.js";

const getConversationHistory = async (documentId) => {
  try {
    const conversation = await Conversation.findOne({
      where: {
        documentId: documentId,
      },
    });
    return {
      success: false,
      conversation: conversation,
      message: "Conversation fetched successfully",
    };
  } catch (err) {
    return { success: false, conversation: null, message: err.message };
  }
};

const getDocumentContext = async (documentId, question) => {
  const pinecone = await initializePinecone();
  const embeddingsModel = initializeEmbeddingsModel();
  const pineconeIndex = await getPineconeIndex(pinecone);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddingsModel, {
    pineconeIndex: pineconeIndex,
    namespace: documentId,
    textKey: "pageContent",
  });

  return await vectorStore.similaritySearch(question, 3);
};
const documentId = "904242dd-642b-4d05-8f19-1e028254e6a5";
const question = "What is the purpose of this document?";

const generateResponse = async (question, documentId) => {
  try {
    const model = initializeGeminiModel();

    if (!model) {
      throw new Error("Model not initialized");
    }
    const relevantDocs = await getDocumentContext(documentId, question);
    const contextText = relevantDocs.map((doc) => doc.pageContent).join("\n\n");
    const historyText = null;
    // const chatHistory = await getChatHistory(documentId, userId);
    // const historyText = chatHistory
    //   .map((h) => `User: ${h.question}\nAssistant: ${h.answer}`)
    //   .join("\n\n");

    // Create prompt
    const prompt = `I'll answer your question based on the following information:

Context from documents:
${contextText}

${historyText ? `Previous conversation:\n${historyText}\n` : ""}

User's question: ${question}

Please provide a detailed and accurate answer based only on the information provided in the context.`;

    // Generate streaming response
    const result = await model.generateContentStream(prompt);

    let fullResponse = "";

    // Stream each chunk
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;

      // Send chunk to client
      // if (res) {
      //   res.write(
      //     `data: ${JSON.stringify({
      //       type: "chunk",
      //       text: chunkText,
      //     })}\n\n`
      //   );
      // }
    }

    // Store in database
    // await storeChatExchange(documentId, userId, question, fullResponse);

    return fullResponse;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

const answer = await generateResponse(question, documentId);
// const answer = await getDocumentContext(documentId, question);
console.log(answer);
