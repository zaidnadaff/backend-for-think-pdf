import sequelize from "../config/db.config";
import { DataTypes } from "sequelize";
import { User } from "./user.model";

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
