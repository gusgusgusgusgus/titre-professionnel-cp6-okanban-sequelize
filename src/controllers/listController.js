import { List } from "../models/List";
import Joi from "joi";

// Fonction pour aller chercher toute les listes présentes en BDD
export async function getAllLists(req, res) {
	const lists = await List.findAll({
		// Je lui donne des consignes pour ordonner les réponses
		order: [
			["position", "ASC"],
			["created_at", "DESC"],
			["tasks", "position", "ASC"],
		],
		// Je lui demande de tout inclure (donc les tâches et les étiquettes)
		include: {
			association: "tasks",
			include: "labels",
		},
	});

	// Et lui demande de me retourner les réponses au format JSON
	res.json(lists);
}

// Fonction pour aller chercher une liste (par son identifiant présent dans la requête) en BDD
export async function getOneList(req, res) {
	// Je récupère l'ID de la liste dans les params
	// Les params sont toujours de type string, donc je convertis en number avant d'envoyer la requête.
	const listId = Number.parseInt(req.params.id);
	// Gestion d'erreur: si l'id demandé n'est pas un nombre, on rejette la requête avec une erreur 400
	if (Number.isNaN(listId)) {
		return res.status(400).json({ error: "The List ID provided is invalid" });
	}

	// J'envoie la requête pour aller chercher la liste en BDD
	const list = await List.findByPk(listId);
	// Gestion d'erreur : si elle n'existe pas, on renvoie une erreur 404
	if (!list) {
		return res.status(404).json({ error: "List not found" });
	}
	// Je lui demande de me retourner la réponse au format JSON
	res.json(list);
}

// Fonction pour aller créer une liste en BDD
export async function createList(req, res) {
  const { name, position } = req.body;
    
  // Sécurisation 1 avec validation manuelle du name fourni
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "Missing or invalid name provided" }); 
    return; 
  }

  // Sécurisation 2 avec validation manuelle de la postion, si elle est fournie
  if (position && ( !Number.isInteger(position))) {
    return res.status(400).json({ error: "Invalid list position provided" });
  }

  // Je crée la liste en BDD 
  const createdList = await List.create({
    name: name, 
    // Si pas de position fournie lors de la création de la liste, je la place en première
    position: position || 1
  });

  // Je confirme la création de la liste
  res.status(201).json(createdList);
}

// Fonction pour aller mettre à jour une liste (par son identifiant présent dans la requête) en BDD
export async function updateList(req, res) {
	const listId = Number.parseInt(req.params.id);
	if (Number.isNaN(listId)) {
		return res.status(400).json({ error: "The List ID provided is invalid" });
	}

	// Je récupère les informations depuis le body
	const body = req.body;

	// On va utiliser Joi pour sécuriser la requête et valider le body
	const updateListSchema = Joi.object({
		name: Joi.string().min(1),
		position: Joi.number().integer().min(1),
	})
		.min(1)
		.message(
			"Missing update information, please provide at least a name or position to update",
		);

	// Gestion d'erreur
	const { error } = updateListSchema.validate(body);
	if (error) {
		return res.status(400).json({ error: error.message });
	}
	// Je recherche la liste concernée par son id
	const list = await List.findByPk(listId);
	if (!list) {
		return res.status(404).json({ error: "List not found" });
	}

	// Je passe les informations à mettre à jour
	const updatedList = await list.update({
		name: body.name,
		position: body.position,
	});

	// Je retourne la liste mise à jour
	res.json(updatedList);
}

// Fonction pour aller supprimer une liste (par son identifiant présent dans la requête) en BDD
export async function deleteList(req, res) {
	const listId = Number.parseInt(req.params.id);
    // Gestion d'erreur si l'ID fourni n'est pas un nombre on rejette la requête
    if (Number.isNaN(listId)) { 
    return res.status(400).json({ error: "Invalid provided List id" });
  }

	// Je recherche la liste concernée par son id
	const list = await List.findByPk(listId);
	// Gestion d'erreur : si elle n'existe pas, on renvoie une erreur 404
	if (!list) {
		return res.status(404).json({ error: "List not found" });
	}

	// Je supprime la liste
	await list.destroy();

	// On renvoie une réponse de confirmation 204, tout en terminant la requête
	res.status(204).end;
}

// Recommandation de sécurité de Fabien Tavernier, prévoir les requêtes brutes
// https://sequelize.org/docs/v6/core-concepts/raw-queries/
export async function query(req, res) {
  const list = await sequelize.query(
    `SELECT * FROM list WHERE id = ${req.params.id}`,
    { type: QueryTypes.SELECT }
  );
  res.json(list);
}