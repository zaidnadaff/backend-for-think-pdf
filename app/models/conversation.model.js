import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";
import { Document } from "./document.model.js";

const Conversation = sequelize.define("Conversation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conversation: { type: DataTypes.JSONB, allowNull: false },
});

Document.hasOne(Conversation);

Conversation.belongsTo(Document);

export { Conversation };
