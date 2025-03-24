import express from "express";
import "dotenv/config";
import documentRouter from "./app/routes/document.route.js";
import sequelize from "./app/config/db.config.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

app.use(documentRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
