import express from "express";
import authMiddleware from "../middleware/auth.js";
import { Document } from "../models/document.model.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {});
