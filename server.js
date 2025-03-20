import express from "express";
import "dotenv/config";
import documentRouter from "./app/routes/document.route.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(documentRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
