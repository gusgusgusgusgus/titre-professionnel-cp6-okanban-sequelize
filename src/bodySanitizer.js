import sanitizeHtml from "sanitize-html";

// Règle d'or pour sécuriser, ne jamais faire confiance à la saisie utilisateur
// Un utilisateur pourrait passer dans le body de sa requête un script malveillant
// On utilise donc Sanitize HTML pour verrouiller toutes les propriétés du body quand il s'agit d'une string

export function bodySanitizer (req, res, next) {
for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === "string") {
      req.body[key] = sanitizeHtml(req.body[key]);
    }
}
  next();
};