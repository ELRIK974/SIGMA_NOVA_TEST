/**
 * SIGMA - Configuration
 * Ce fichier contient toutes les constantes de configuration de l'application
 */

// Configuration de la base de données
const CONFIG = {
  // ID du classeur Google Sheets utilisé comme base de données
  SPREADSHEET_ID: '1hdj86LiRWY7K1vIHYh0NwIM8M_HKEy7P9SGezhDC70M',
  
  // Noms des feuilles utilisées
  SHEETS: {
    STOCK: 'Stock',
    EMPRUNTS: 'Emprunts',
    MODULES: 'Modules',
    LIVRAISONS: 'Livraisons'
  },
  
  // Taille de pagination par défaut
  DEFAULT_PAGE_SIZE: 10,
  
  // Version de l'application
  APP_VERSION: '1.0'
};

// Fonction pour obtenir la configuration
function getConfig() {
  return CONFIG;
}
