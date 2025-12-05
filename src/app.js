import "dotenv/config";
import express from "express";
import cors from "cors";
import { database, connectDatabase } from "./database.js";

import "./models/index.js";

import authRoutes from "./routes/authRotes.js";
import chamadosRoutes from "./routes/chamados.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import homeRoutes from "./routes/home.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/chamados", chamadosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/home', homeRoutes)

const PORT = process.env.PORT || 3000; // Adiciona um fallback para a porta

app.listen(PORT, async () => {
  try {
    await connectDatabase();
    await database.sync();
    console.log(`Servidor  na porta ${PORT}`);
  } catch (error) {
    console.error('Erro ao iniciar o servidor ou sincronizar as tabelas:', error);
  }
});


