import bcrypt from "bcrypt";
import { Usuarios } from "../models/index.js";

const createUsuario = async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .send({ mensagem: "Nome email e senha sao obrigatorios" });
    }

    const usuarioExistente = await Usuarios.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).send({ mensagem: "Ja esta em uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = await Usuarios.create({
      nome,
      email,
      senha: senhaCriptografada,
      perfil: perfil || "usuario",
    });

    novoUsuario.senha = undefined;

    res.status(200).send(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuario ", error);
    res.status(500).send({ mensagem: "Erro interno" });
  }
};

export { createUsuario };
