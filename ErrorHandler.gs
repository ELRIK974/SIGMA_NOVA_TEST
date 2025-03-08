/**
 * SIGMA - Gestionnaire d'erreurs centralisé
 * Ce fichier contient les fonctions pour gérer les erreurs de manière uniforme
 */

/**
 * Traite une erreur et retourne une réponse formatée
 * @param {Error} error - L'erreur à traiter
 * @param {string} functionName - Le nom de la fonction où l'erreur s'est produite
 * @param {Object} context - Des informations supplémentaires sur le contexte
 * @returns {Object} Une réponse formatée avec des informations sur l'erreur
 */
function handleServerError(error, functionName, context = {}) {
  // Journaliser l'erreur
  console.error(`Erreur dans ${functionName}: ${error.message}`);
  console.error(error.stack);
  
  // Déterminer un message utilisateur approprié
  let userMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
  
  if (error.message.includes("Access denied") || error.message.includes("Permission")) {
    userMessage = "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
  }
  else if (error.message.includes("Limit exceeded") || error.message.includes("Quota")) {
    userMessage = "Limite d'utilisation dépassée. Veuillez réessayer plus tard.";
  }
  else if (error.message.includes("not found") || error.message.includes("n'existe pas")) {
    userMessage = "La ressource demandée n'a pas été trouvée.";
  }
  
  // Construire la réponse d'erreur
  return {
    success: false,
    error: {
      message: error.message,
      userMessage: userMessage,
      source: functionName,
      timestamp: new Date().toISOString(),
      context: context
    }
  };
}

/**
 * Encapsule une fonction avec gestion des erreurs
 * @param {Function} fn - La fonction à exécuter
 * @param {string} functionName - Le nom de la fonction pour le logging
 * @returns {Function} Fonction avec gestion d'erreur intégrée
 */
function withErrorHandling(fn, functionName) {
  return function() {
    try {
      return fn.apply(this, arguments);
    } catch (error) {
      return handleServerError(error, functionName, { args: Array.from(arguments) });
    }
  };
}
