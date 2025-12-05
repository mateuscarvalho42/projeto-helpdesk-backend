import jwt from "jsonwebtoken";

const segredoJwt = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ mensagem: "Token inválido ou ausente" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, segredoJwt);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).send({ mensagem: "Token inválido ou expirado" });
  }
};

export { authMiddleware };
