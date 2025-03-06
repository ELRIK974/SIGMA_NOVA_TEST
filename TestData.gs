/**
 * SIGMA - Données de test
 * Ce fichier contient des fonctions pour générer des données de test
 */

// Fonction pour ajouter des emprunts de test
function addTestEmprunts() {
  try {
    const sheet = getSheetByName("Emprunts");
    
    // Vérifier si la feuille existe
    if (!sheet) {
      console.error("La feuille 'Emprunts' n'existe pas");
      return "Erreur: La feuille 'Emprunts' n'existe pas";
    }
    
    // Vérifier si des en-têtes existent déjà
    let headers = [];
    if (sheet.getLastRow() > 0) {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    } else {
      // Définir les en-têtes si la feuille est vide
      headers = ["ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", "Secteur", "Référent", "Emprunteur", "Statut", "Date création"];
      sheet.appendRow(headers);
    }
    
    // Ajouter des emprunts de test
    const testEmprunts = [
      {
        ID: generateUniqueId(),
        "Nom Manipulation": "Animation Astronomie",
        "Lieu": "Collège Jean Moulin",
        "Date départ": "01/03/2025",
        "Date retour": "15/03/2025",
        "Secteur": "Astronomie",
        "Référent": "Thomas Durand",
        "Emprunteur": "Marie Dupont",
        "Statut": "Pas prêt",
        "Date création": new Date().toLocaleDateString("fr-FR")
      },
      {
        ID: generateUniqueId(),
        "Nom Manipulation": "Atelier Robotique",
        "Lieu": "École Primaire Voltaire",
        "Date départ": "10/03/2025",
        "Date retour": "12/03/2025",
        "Secteur": "Robotique",
        "Référent": "Sophie Martin",
        "Emprunteur": "Sophie Martin",
        "Statut": "Prêt",
        "Date création": new Date().toLocaleDateString("fr-FR")
      },
      {
        ID: generateUniqueId(),
        "Nom Manipulation": "Exposition Biodiversité",
        "Lieu": "Médiathèque Centrale",
        "Date départ": "15/02/2025",
        "Date retour": "28/02/2025",
        "Secteur": "Environnement",
        "Référent": "Lucas Bernard",
        "Emprunteur": "Julie Petit",
        "Statut": "Revenu",
        "Date création": new Date(Date.now() - 15*24*60*60*1000).toLocaleDateString("fr-FR")
      }
    ];
    
    let addedCount = 0;
    
    // Ajouter chaque emprunt de test
    testEmprunts.forEach(emprunt => {
      // Vérifier que l'emprunt n'existe pas déjà (basé sur le nom et le lieu)
      const allEmprunts = getAllEmprunts();
      const exists = allEmprunts.some(e => 
        e["Nom Manipulation"] === emprunt["Nom Manipulation"] && 
        e["Lieu"] === emprunt["Lieu"]
      );
      
      if (!exists) {
        // Créer un tableau dans le même ordre que les en-têtes
        const rowArray = headers.map(header => emprunt[header] || '');
        
        // Ajouter la ligne
        sheet.appendRow(rowArray);
        addedCount++;
      }
    });
    
    return `${addedCount} emprunts de test ajoutés avec succès`;
  } catch (error) {
    console.error("Erreur lors de l'ajout des emprunts de test:", error);
    return "Erreur: " + error.toString();
  }
}
// Fonction pour tester la connexion à la feuille Emprunts
function testEmpruntsConnection() {
  try {
    const sheet = getSheetByName("Emprunts");
    
    if (!sheet) {
      const spreadsheet = getSpreadsheet();
      const newSheet = spreadsheet.insertSheet("Emprunts");
      newSheet.appendRow(["ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", "Secteur", "Référent", "Emprunteur", "Statut", "Date création"]);
      
      return {
        success: true,
        message: "Feuille Emprunts créée avec succès",
        sheetName: "Emprunts"
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    return {
      success: true,
      message: "Connexion à la feuille Emprunts réussie",
      rowCount: data.length,
      headers: data[0]
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors du test de la feuille Emprunts: " + error.toString(),
      error: error.toString()
    };
  }
}
