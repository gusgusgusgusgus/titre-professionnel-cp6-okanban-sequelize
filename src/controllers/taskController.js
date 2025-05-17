import Joi from "joi";
import { Task, List } from "../models/index.js";

// Fonction pour aller chercher toute les tâches présentes en BDD
export async function getAllTasks(req, res) {
	const tasks = await Task.findAll({
		order: [
			["position", "ASC"],
			["created_at", "DESC"],
		],
	});

	res.status(200).json(task);
}

// Fonction pour aller chercher une tâche (par son identifiant présent dans la requête) en BDD
export async function getOneTask(req, res) {
	const taskId = Number.parseInt(req.params.id);
	const task = await Task.findByPk(taskId, { include: "labels" });
	if (!task) {
		return res
			.status(404)
			.json({ error: "Task not found" });
	}

	res.status(200).json(task);
}

// Fonction pour aller créer une tâche en BDD
export async function createTask(req, res) {
	const createTaskSchema = Joi.object({
		title: Joi.string().min(1).required(),
		id_list: Joi.number().integer().required(),
		color: Joi.string(7),
		position: Joi.number().integer().min(1),
	})
    .min(1)
		.message(
			"Missing information, please provide all the information needed (title, color and corresponding List)",
		);;

	const { error } = createTaskSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ error: error.message });
	}

	const task = await Task.create({
		title: req.body.title,
		id_list: Number.parseInt(req.body.id_list),
		position: req.body.position || 1, 
		color: req.body.color || null, 
	});

	// Réponse
	res.status(201).json(task);
}

// Fonction pour aller mettre à jour une tâche (par son identifiant présent dans la requête) en BDD
export async function updateTask(req, res) {
	// Parsing
	const taskId = Number.parseInt(req.params.id);

    const updateTaskSchema = Joi.object({
		title: Joi.string().min(1).required(),
		id_list: Joi.number().integer().required(),
		color: Joi.string(7),
		position: Joi.number().integer().min(1),
	})
		.min(1)
		.message(
			"Missing information, please provide all the information needed (title, color, position and corresponding List)",
		);

	const { error } = updateTaskSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ error: error.message });
	}

	const listId = req.body.list_id;
	if (listId && !(await doesListExist(listId))) {
		return res
			.status(400)
			.json({ error: "Invalid request: the list selected does not exist." });
	}

	const task = await Task.findByPk(taskId);
	if (!task) {
		return res
			.status(400)
			.json({ error: "The task does not exist, please verify your request" });
	}

	const updatedTask = await task.update({
		title: req.body.title || task.title,
		position: req.body.position || task.position,
		color: req.body.color || task.color,
		id_list: req.body.id_list || task.id_list,
	});

	res.status(200).json(updatedTask);
}

// Fonction pour aller supprimer une tâche (par son identifiant présent dans la requête) en BDD
export async function deleteTask(req, res) {
	const taskId = Number.parseInt(req.params.id);

	const task = await Task.findByPk(taskId);
	if (!task) {
		return res
			.status(404)
			.send({ error: "Task not found" });
	}

	await task.destroy();

	res.status(204).end();
}

export async function getAllTasksOfList(req, res) {
	const listId = Number.parseInt(req.params.id);

	const tasks = await Task.findAll({
		where: { id_list: listId },
		include: "labels",
	});

	res.status(200).json(tasks);
}

// Je réutilise une méthode montrée par le prof pour tester la validité d'une liste (DRY principle)
async function doesListExist(listId) {
	const list = await List.findByPk(listId);
	return !!list; // Si list est null, alors ça vaut false. Si list vaut { ... } ça vaut true.
}
