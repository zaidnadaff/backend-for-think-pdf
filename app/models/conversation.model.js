import sequelize from "../config/db.config";
import { DataTypes } from "sequelize";
import { Document } from "./document.model";

const Conversation = sequalize.define("conversation", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation: { type: DataTypes.JSONB, allowNull: false },
});

Document.hasOne(Conversation);
Conversation.belongsTo(Document);

export { Conversation };
