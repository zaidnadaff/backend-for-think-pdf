import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: true,
  }
);

export { User };
