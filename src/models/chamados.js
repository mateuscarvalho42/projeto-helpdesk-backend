import { database } from "../database.js";
import { DataTypes, Sequelize } from "sequelize";

const Chamados = database.define(
  "chamados",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    prioridade: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "baixa",
      validate: {
        isIn: [["baixa", "media", "alta"]],
      },
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "aberto",
      validate: {
        isIn: [["aberto", "em andamento", "fechado"]],
      },
    },
  },
  {
    tableName: "chamados",
    timestamps: true,
    createdAt: "criado_em",
    updatedAt: "atualizado_em",
  }
);

export { Chamados };
