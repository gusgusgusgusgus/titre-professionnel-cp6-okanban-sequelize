import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.PG_URL, {
  logging: false, // Pour ne pas encombrer ma console avec les logs de Sequelize
  define: {
    timestamps: true, // Pour que Sequelize log les actions en BDD
    createdAt: "created_at", // Par défaut Sequelize utilise createdAt, je lui indique que pour moi ce sera created_at
    updatedAt: "updated_at" // idem que pour createdAt
  }
});
