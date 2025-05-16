import { Task } from "./task.js";
import { List } from "./List.js";
import { Label } from "./Label.js";
import { sequelize } from "./sequelizeClient.js";

// Association List- Task : One-to-Many
List.hasMany(Task, {
  as: "tasks", 
  foreignKey: "list_id"
});

Task.belongsTo(List, {
  as: "list",
  foreignKey: "list_id"
});

// Association Task - Label : Many-to-Many
export const Categorise = sequelize.define("categorise", {}, { tableName: "categorise" });

Task.belongsToMany(Label, {
  as: "labels",
  through: Categorise,
  foreignKey: "task_id",
  otherKey: "label_id"
});

Label.belongsToMany(Task, {
  as: "tasks",
  through: Categorise,
  foreignKey: "label_id",
  otherKey: "task_id"
});

export { Task, List, Label };
