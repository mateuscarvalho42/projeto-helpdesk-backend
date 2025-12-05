import { Usuarios } from "./usuarios.js";
import { Chamados } from "./chamados.js";

Usuarios.hasMany(Chamados, {
  foreignKey: "usuario_id",
  as: "chamados",
});

Chamados.belongsTo(Usuarios, {
  foreignKey: "usuario_id",
  as: "usuario",
});

export { Usuarios, Chamados };
