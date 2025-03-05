/**
 * SIGMA - Fonctions d'initialisation et de configuration
 * Ce fichier contient des fonctions utilitaires pour configurer l'application
 */

// Fonction pour initialiser des données de test dans la feuille Stock
function initializeTestData() {
  const sheet = getSheetByName("Stock");
  
  // Vérifier si la feuille existe
  if (!sheet) {
    console.error("La feuille 'Stock' n'existe pas");
    // Créer la feuille Stock si elle n'existe pas
    const spreadsheet = getSpreadsheet();
    spreadsheet.insertSheet("Stock");
    sheet = getSheetByName("Stock");
  }
  
  // Définir les en-têtes
  sheet.clear();
  sheet.appendRow([
    "ID", "Nom", "Catégorie", "Quantité", "Seuil alerte", "Localisation", 
    "Référence fournisseur", "Lien fournisseur"
  ]);
  
  // Ajouter des données de test
  const testItems = [
    {
      ID: Utilities.getUuid(),
      Nom: "Tablette Android",
      Catégorie: "Non consommable",
      Quantité: 5,
      "Seuil alerte": 3,
      Localisation: "Armoire A",
      "Référence fournisseur": "TAB-001",
      "Lien fournisseur": ""
    },
    {
      ID: Utilities.getUuid(),
      Nom: "Câble HDMI 2m",
      Catégorie: "Consommable",
      Quantité: 10,
      "Seuil alerte": 5,
      Localisation: "Tiroir B",
      "Référence fournisseur": "HDMI-2M",
      "Lien fournisseur": ""
    },
    {
      ID: Utilities.getUuid(),
      Nom: "Batterie externe",
      Catégorie: "Consommable",
      Quantité: 3,
      "Seuil alerte": 2,
      Localisation: "Étagère C",
      "Référence fournisseur": "BAT-EXT",
      "Lien fournisseur": ""
    }
  ];
  
  // Ajouter chaque article à la feuille
  testItems.forEach(item => {
    const rowArray = [
      item.ID,
      item.Nom,
      item.Catégorie,
      item.Quantité,
      item["Seuil alerte"],
      item.Localisation,
      item["Référence fournisseur"],
      item["Lien fournisseur"]
    ];
    sheet.appendRow(rowArray);
  });
  
  return "Données de test initialisées avec succès";
}
