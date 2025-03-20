import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

const Document = sequelize.define(
  "document",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Document);
Document.belongsTo(User);

export { Document };
