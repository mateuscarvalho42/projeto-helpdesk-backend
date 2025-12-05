import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const homeRoutes = Router();

homeRoutes.use(authMiddleware);
homeRoutes.post("/", (req, res) => {res.json({user: req.usuario.nome, perfil: req.usuario.perfil})})

export default homeRoutes;

