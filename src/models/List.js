import { sequelize } from "./sequelizeClient.js";
import { Model, DataTypes } from "sequelize";

export class List extends Model {}

List.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  sequelize,
  modelName: "List"
  tableName: "list"
});
