import {
  generateResponse,
  getConversationHistory,
  initializeConversation,
} from "../services/conversation.service.js";
import express from "express";

const conversationRouter = express.Router();

conversationRouter.post("/ask", async (req, res) => {
  try {
    const { documentId, question } = req.body;
    if (!documentId || !question) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }
    await initializeConversation(documentId);

    const response = await generateResponse(question, documentId);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error in /ask route:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

conversationRouter.post("/get-conversation", async (req, res) => {
  try {
    const { documentId } = req.body;
    const conversation = await getConversationHistory(documentId);
    res.json(conversation);
  } catch (error) {
    console.error("Error in /get-conversation route:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default conversationRouter;
