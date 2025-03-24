import { Conversation } from "../models/conversation.model.js";
import {
  getPineconeIndex,
  initializePinecone,
} from "../config/pinecone.config.js";
import { initializeEmbeddingsModel } from "../config/gemini.config.js";
import { PineconeStore } from "@langchain/pinecone";
import { initializeGeminiModel } from "../config/gemini.config.js";

// Initialize empty conversation for a document
const initializeConversation = async (documentId) => {
  try {
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      where: { DocumentId: documentId },
    });

    if (existingConversation) {
      return {
        success: true,
        message: "Conversation already exists",
        conversation: existingConversation,
      };
    }

    // Create new empty conversation
    const newConversation = await Conversation.create({
      DocumentId: documentId,
      conversation: [], // Empty array to store conversation history
    });

    return {
      success: true,
      message: "Conversation initialized successfully",
      conversation: newConversation,
    };
  } catch (err) {
    console.error("Error initializing conversation:", err);
    return { success: false, message: err.message };
  }
};

// Get conversation history
const getConversationHistory = async (documentId) => {
  try {
    const conversation = await Conversation.findOne({
      where: {
        DocumentId: documentId,
      },
    });
    return {
      success: true,
      conversation: conversation.conversation,
      message: "Conversation fetched successfully",
    };
  } catch (err) {
    return { success: false, conversation: null, message: err.message };
  }
};

// Store a new exchange in the conversation history
const storeConversationExchange = async (documentId, question, answer) => {
  try {
    const { conversation } = await getConversationHistory(documentId);

    // Add the new exchange
    const updatedConversation = [
      ...conversation,
      { question, answer, timestamp: new Date() },
    ];

    // Update the conversation in the database
    await Conversation.update(
      { conversation: updatedConversation },
      { where: { DocumentId: documentId } }
    );

    return {
      success: true,
      message: "Conversation updated successfully",
    };
  } catch (err) {
    console.error("Error storing conversation exchange:", err);
    return { success: false, message: err.message };
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

const generateResponse = async (question, documentId) => {
  try {
    const model = initializeGeminiModel();
    if (!model) {
      throw new Error("Model not initialized");
    }

    // Get document context
    const relevantDocs = await getDocumentContext(documentId, question);
    const contextText = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

    // Get conversation history
    const { conversation } = await getConversationHistory(documentId);
    const historyText = conversation
      .map((h) => `User: ${h.question}\nAssistant: ${h.answer}`)
      .join("\n\n");

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
      // Send chunk to client if needed
      // if (res) {
      //   res.write(
      //     `data: ${JSON.stringify({
      //       type: "chunk",
      //       text: chunkText,
      //     })}\n\n`
      //   );
      // }
    }

    // Store in conversation history
    await storeConversationExchange(documentId, question, fullResponse);

    return fullResponse;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

export {
  initializeConversation,
  getConversationHistory,
  generateResponse,
  storeConversationExchange,
};
