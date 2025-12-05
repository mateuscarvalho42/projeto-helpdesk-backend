import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuarios } from "../models/index.js";

const segredoJwt = process.env.JWT_SECRET;
if (!segredoJwt) {
  throw new Error("Variavel de ambiente nao definida");
}

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).send({ mensagem: "Email e senha obrigatorio" });
    }
    const usuarioEscolhido = await Usuarios.findOne({
      where: { email: email },
    });

    if (!usuarioEscolhido) {
      return res.status(401).send({ mensagem: "Credenciais invalidas" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioEscolhido.senha);

    if (!senhaCorreta) {
      return res.status(401).send({ mensagem: "Credenciais invalidas" });
    }

    const payload = {
      idUsuario: usuarioEscolhido.id,
      perfil: usuarioEscolhido.perfil,
      nome: usuarioEscolhido.nome,
    };

    const token = jwt.sign(payload, segredoJwt, { expiresIn: "5h" });

    res.status(200).send({
      mensagem: "Logado com sucesso",
      token: token,
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    res.status(500).send({ mensagem: "Ocorreu um erro interno no servidor." });
  }
};

export { login };
