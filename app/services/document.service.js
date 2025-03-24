import { Document } from "../models/document.model.js";
import { Conversation } from "../models/conversation.model.js";

const saveDocument = async (userId, documentId, title) => {
  try {
    await Document.create({
      id: documentId,
      title: title,
      userId: userId,
    });

    await Conversation.create({
      conversation: [],
      DocumentId: documentId,
    });
    return { success: true, message: "Document saved successfully" };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};

const getAllDocuments = async (userId) => {
  try {
    const documents = await Document.findAll({
      where: {
        userId: userId,
      },
    });
    return {
      success: true,
      documents: documents,
      message: "Documents fetched successfully",
    };
  } catch (err) {
    return { success: false, documents: null, message: err.message };
  }
};

const getDocument = async (userId, documentId) => {
  try {
    const document = await Document.findOne({
      where: {
        userId: userId,
        id: documentId,
      },
    });
    if (!document) {
      throw new Error("Document not found");
    }
    return {
      success: true,
      document: document,
      message: "Document fetched successfully",
    };
  } catch (err) {
    return { success: false, document: null, message: err.message };
  }
};

export { saveDocument, getAllDocuments, getDocument };
