import { DataTypes } from "sequelize";
import { database } from "../database.js";

const Usuarios = database.define(
  "usuarios",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    perfil: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "usuario",
      validate: {
        isIn: [["usuario", "tecnico"]],
      },
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

export { Usuarios };
