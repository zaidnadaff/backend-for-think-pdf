import express from "express";

const conversationRouter = express.Router();

conversationRouter.post("/retrieve", async (req, res) => {
  try {
    const { userId, documentId } = req.body;
    if (!userId) {
      throw new Error("Missing User Id");
    }
    if (!documentId) {
      throw new Error("Missing Document Id");
    }
    const { success, document, message } = await getDocument(
      userId,
      documentId
    );
    if (!success) {
      throw new Error(message);
    }
    res.status(200).json({ message: message, Document: document });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
