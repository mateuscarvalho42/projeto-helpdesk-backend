import { Router } from "express";
import { createUsuario } from "../controllers/usuarioController.js";

const usuariosRoutes = Router();

usuariosRoutes.post("/", createUsuario);

export default usuariosRoutes;
