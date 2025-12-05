import { Chamados, Usuarios } from "../models/index.js";

const createChamado = async (req, res) => {
  try {
    const { titulo, descricao, categoria, prioridade } = req.body;
    const usuario_id = req.usuario.userId;

    if (!titulo || !descricao) {
      return res
        .status(400)
        .send({ mensagem: "Titulo e descrição sao obrigatorios" });
    }

    const novoChamado = await Chamados.create({
      titulo,
      descricao,
      categoria,
      prioridade,
      usuario_id,
    });

    res.status(201).send(novoChamado);
  } catch (error) {
    console.error("Erro ao criar chamado ", error);
    res.status(500).send({ mensagem: "Erro interno" });
  }
};

const getAllChamados = async (req, res) => {
  try {
    console.log("Usuário autenticado:", req.usuario);

    const { perfil, userId, id } = req.usuario;
    const usuarioId = userId || id;

    if (!usuarioId) {
      return res
        .status(400)
        .send({ mensagem: "Usuário não identificado no token" });
    }

    let filtro = {};
    if (perfil !== "tecnico") {
      filtro = { where: { usuario_id: usuarioId } };
    }

    const chamados = await Chamados.findAll({
      ...filtro,
      include: [
        { model: Usuarios, as: "usuario", attributes: ["id", "nome", "email"] },
      ],
      order: [["criado_em", "DESC"]],
    });

    res.status(200).send(chamados);
  } catch (error) {
    console.error("ERRO AO BUSCAR CHAMADOS ===>", error);
    res.status(500).send({ mensagem: "Erro interno" });
  }
};

const getChamadoById = async (req, res) => {
  try {
    const { perfil, userId } = req.usuario;

    console.log(perfil, userId);
    const chamado = await Chamados.findAll({
      where: { usuario_id: userId },
      include: [
        { model: Usuarios, as: "usuario", attributes: ["id", "nome", "email"] },
      ],
    });
    console.log(chamado);

    if (!chamado) {
      return res.status(404).send({ mensagem: "Chamado não encontrado" });
    }

    res.status(200).send(chamado);
  } catch (error) {
    res.status(500).send({ mensagem: "Erro interno" });
  }
};

const updateChamado = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;
    const { perfil, userId } = req.usuario;

    const chamado = await Chamados.findByPk(id);

    if (!chamado) {
      return res.status(404).send({ mensagem: "Chamado não encontrado" });
    }

    if (perfil !== "tecnico") {
      if (chamado.usuario_id !== userId) {
        return res.status(403).send({ mensagem: "Não tem acesso" });
      }
      delete dadosAtualizacao.status;
    }

    await chamado.update(dadosAtualizacao);
    res.status(200).send(chamado);
  } catch (error) {
    console.error("Erro ao atualizar ", error);
    res.status(500).send({ mensagem: "Erro interno" });
  }
};

const deleteChamado = async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil, userId } = req.usuario;

    const chamado = await Chamados.findByPk(id);

    if (!chamado) {
      return res.status(404).send({ mensagem: "Chamado não encontrado" });
    }

    if (perfil !== "tecnico" && chamado.usuario_id !== userId) {
      return res.status(403).send({
        mensagem: "Não tem acesso",
      });
    }

    await chamado.destroy();
    res.status(200).send({ mensagem: "Chamado removido com sucesso" });
  } catch (error) {
    res.status(500).send({ mensagem: "Erro interno" });
  }
};

export {
  createChamado,
  getAllChamados,
  getChamadoById,
  updateChamado,
  deleteChamado,
};
