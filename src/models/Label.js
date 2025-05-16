import { sequelize } from "./sequelizeClient.js";
import { Model, DataTypes } from "sequelize";

export class Label extends Model {}

Label.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  color: {
    // Je vais utiliser des codes hexadecimaux pour les couleurs, donc 7 caractères max
    // Je vais dire à Sequelize de typer le champs en string avec une limite de 7 caractères:
    type: DataTypes.STRING(7)
  }
}, {
  sequelize,
  modelName: "Label",
  tableName: "label"
});
