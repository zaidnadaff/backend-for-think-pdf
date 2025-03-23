import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

Document.associate = (models) => {
  Document.belongsTo(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Document.hasOne(models.Conversation, {
    foreignKey: "documentId",
    as: "conversation",
  });
};

export { Document };
