import { Conversation } from "../models/conversation.model";

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
