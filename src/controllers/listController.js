import { List } from "../models/List"

// Fonction pour aller chercher toute les listes présentes en BDD
export async function getAllLists(req, res) {
    const lists = await List.findAll({
        // Je lui donne des consignes pour ordonner les réponses
        order: [
      ["position", "ASC"],
      ["created_at", "DESC"],
      ["tasks", "position", "ASC"]
    ],
    // Je lui demande de tout inclure (donc les tâches et les étiquettes)
    include: {
        association: "tasks",
        include: "labels"
    }
    });

    // Et lui demande de me retourner les réponses au format JSON
    res.json(lists)
}

// Fonction pour aller chercher une liste (par son identifiant présent dans la requête) en BDD
export async function getOneList(req, res) {
    // Je récupère l'ID de la liste dans les params
    // Les params sont toujours de type string, donc je convertis en number avant d'envoyer la requête.
    const listId = Number.parseInt(req.params.id) 

    // J'envoie la requête pour aller chercher la liste en BDD
    const list = await List.findByPk(listId)
    // Gestion d'erreur : si elle n'existe pas, on renvoie une erreur 404
    if (!list) {
        return res.status(404).json({error : "List not found"})
    }
    // Je lui demande de me retourner la réponse au format JSON
    res.json(list)
}
