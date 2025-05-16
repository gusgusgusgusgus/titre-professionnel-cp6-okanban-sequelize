import Joi from "joi";
import { Task, Label } from "../models/index.js";

// Fonction pour aller chercher toute les étiquettes présentes en BDD
export async function getAllLabels(req, res) {
  const labels = await Label.findAll();
  res.json(labels);
}

// Fonction pour aller chercher une étiquette (par son identifiant présent dans la requête) en BDD
export async function getOneLabel(req, res) {
  const labelId = Number.parseInt(req.params.id);
  if (! labelId) { return res.status(404).json({ error: "Label not found" }); }

  const label = await Label.findByPk(labelId);
  if (! label) { return res.status(404).json({ error: "Label not found" }); }

  res.json(label);
}

// Fonction pour aller créer une étiquette en BDD
export async function createLabel(req, res) {
  const createLabelSchema = Joi.object({
    name: Joi.string().min(1).required(),
    color: Joi.string(7),
  });
  const { error } = createLabelSchema.validate(req.body);
  if (error) { return res.status(400).json({ error: error.message }); }


  const { name, color } = req.body;

  // Je vérifie s'il n'existe pas déjà une étiquette du même nom en BDD
  const alreadyExistingLabel = await Label.findOne({ where: { name }});
  if (alreadyExistingLabel) { return res.status(400).json({ error: "An existing Label with same name already exists" }); }

  const label = await Label.create({ name, color });

  res.status(201).json(label);
}

// Fonction pour aller mettre à jour une étiquette (par son identifiant présent dans la requête) en BDD
export async function updateLabel(req, res) {
  const labelId = Number.parseInt(req.params.id);
  
  const updateLabelSchema = Joi.object({
    name: Joi.string().min(1),
    color: Joi.string(7),
  }).min(1).message("Missing information, please provide all the information needed (name and color)");
  
  const { error } = updateLabelSchema.validate(req.body);
  if (error) { return res.status(400).json({ error: error.message }); }

  const label = await Label.findByPk(labelId);
  if (! label) { return res.status(404).json({ error: "Label not found" }); }

  const { name, color } = req.body;

  const alreadyExistingLabel = await Label.findOne({ where: { name }});
  if (alreadyExistingLabel) { return res.status(400).json({ error: "An existing Label with same name already exists" }); }

  label.name = name || label.name;
  label.color = color || label.color;
  await label.save();

  res.json(label);
}

// Fonction pour aller supprimer une étiquette (par son identifiant présent dans la requête) en BDD
export async function deleteLabel(req, res) {
  const labelId = req.params.id;

  const label = await Label.findByPk(labelId);
  if (! label) {
    return res.status(404).send({ error: "Label not found" });
  }

  await label.destroy();

  res.status(204).end();
}

// Fonction pour ajouter une étiquette à une tâche (par leurs identifiants présents dans la requête) en BDD
export async function addLabelToTask(req, res) {
  const { taskId, labelId } = req.params;

  if (Number.isNaN(Number.parseInt(taskId))) {
    return res.status(400).json({ error: "Invalid ID provided for the Task" });
  }

  if (Number.isNaN(Number.parseInt(labelId))) {
    return res.status(400).json({ error: "Invalid ID provided for the Label" });
  }

  const task = await Task.findByPk(taskId);
  if (! task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const label = await Label.findByPk(labelId);
  if (! label) {
    return res.status(404).json({ error: "Label not found" });
  }

  await task.addLabel(label); 
  
  const updatedTask = await Task.findByPk(taskId, { include: ["labels"] });
  res.status(201).json(updatedTask);
}

// Fonction pour retirer une étiquette à une tâche (par leurs identifiants présents dans la requête) en BDD
export async function removeLabelFromTask(req, res) {
  const { taskId, labelId } = req.params;

 if (Number.isNaN(Number.parseInt(taskId))) {
    return res.status(400).json({ error: "Invalid ID provided for the Task" });
  }

  if (Number.isNaN(Number.parseInt(labelId))) {
    return res.status(400).json({ error: "Invalid ID provided for the Label" });
  }
  
  const task = await Task.findByPk(taskId);
  if (! task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const label = await Label.findByPk(labelId);
  if (! label) {
    return res.status(404).json({ error: "Label not found" });
  }

  await task.removeLabel(label);

  const updatedTask = await Task.findByPk(taskId, { include: ["labels"] });
  res.json(updatedTask);
}
