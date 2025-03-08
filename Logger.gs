/**
 * SIGMA - Système de journalisation
 * Ce fichier contient les fonctions pour consigner les activités importantes
 */

/**
 * Types d'actions pour la journalisation
 */
const LOG_ACTIONS = {
  CREATE: "Création",
  UPDATE: "Modification",
  DELETE: "Suppression",
  EXPORT: "Exportation",
  IMPORT: "Importation",
  LOGIN: "Connexion",
  ERROR: "Erreur"
};

/**
 * Enregistre une action dans le journal d'activité
 * @param {string} action - Type d'action (utiliser LOG_ACTIONS)
 * @param {string} module - Module concerné (Stock, Emprunts, etc.)
 * @param {string} description - Description de l'action
 * @param {string} userId - Identifiant de l'utilisateur (email)
 * @param {object} details - Détails supplémentaires (optionnel)
 */
function logActivity(action, module, description, userId = null, details = null) {
  try {
    // Obtenir l'utilisateur actuel si non spécifié
    if (!userId) {
      userId = Session.getActiveUser().getEmail();
    }
    
    // Créer l'entrée de journal
    const logEntry = {
      Timestamp: new Date(),
      Action: action,
      Module: module,
      Description: description,
      UserId: userId,
      Details: details ? JSON.stringify(details) : ""
    };
    
    // En mode développement, enregistrer dans la console
    console.log(`LOG: [${logEntry.Action}] ${logEntry.Module} - ${logEntry.Description} (${logEntry.UserId})`);
    
    // TODO: Dans une version future, enregistrer dans une feuille dédiée
    // addRow("Journal", logEntry);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la journalisation:", error);
    return false;
  }
}
