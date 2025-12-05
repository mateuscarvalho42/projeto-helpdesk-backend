import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Usuarios } from "../models/usuarios.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Nome e email sao obrigatorios" });
    }

    if (perfil && !["usuario", "tecnico"].includes(perfil)) {
      return res.status(400).json({ message: "Perfil invalido" });
    }

    const userExists = await Usuarios.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ message: "Email ja existe" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuarios.create({
      nome,
      email,
      senha: hashedPassword,
      perfil: perfil || "usuario",
    });

    res
      .status(201)
      .json({ message: "usuario cadastrado com sucesso", id: novoUsuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha sao obrigatorios" });
    }

    const usuario = await Usuarios.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: "Nao encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha errada" });
    }

    const token = jwt.sign(
      { userId: usuario.id, perfil: usuario.perfil, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
