import express from "express";
import fs from "fs";
import { processPDF } from "../services/pdfService.js";
// import authMiddleware from "../middleware/auth.js";
import { getAllDocuments } from "../services/document.service.js";
import { User } from "../models/user.model.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const documentRouter = express.Router();

documentRouter.post("/list", async (req, res) => {
  try {
    if (!req.body.userId) {
      throw new Error("Missing User Id");
    }
    const { success, documents, message } = await getAllDocuments(
      req.body.userId
    );
    if (!success) {
      throw new Error(message);
    }
    res.status(200).json({ message: message, Documents: documents });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
documentRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.body.userId) {
      throw new Error("Missing User Id");
    }
    if (!req.file) {
      throw new Error("Missing File");
    }
    const user = User.findOne({
      where: {
        id: req.body.userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const file = req.file;
    const { documentId, message } = await processPDF(
      file.path,
      file.filename,
      req.body.userId
    );
    if (!documentId) {
      throw new Error(message);
    }
    res.json({ message: "File uploaded Successfully", id: documentId });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

export default documentRouter;
