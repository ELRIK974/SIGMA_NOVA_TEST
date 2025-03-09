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
// Vérifier et créer la feuille Emprunts si nécessaire
function checkAndCreateEmpruntsSheet() {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName("Emprunts");
  
  // Si la feuille n'existe pas, la créer
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Emprunts");
    
    // Ajouter les en-têtes
    const headers = [
      "ID", 
      "Nom Manipulation", 
      "Lieu", 
      "Date départ", 
      "Date retour", 
      "Secteur", 
      "Référent", 
      "Emprunteur", 
      "Statut", 
      "Date création",
      "Notes"
    ];
    
    sheet.appendRow(headers);
    
    Logger.log("Feuille Emprunts créée avec succès");
    return "Feuille Emprunts créée avec succès";
  }
  
  Logger.log("La feuille Emprunts existe déjà");
  return "La feuille Emprunts existe déjà";
}
// Fonction de diagnostic pour la feuille Emprunts
function diagnoseEmpruntsSheet() {
  try {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Emprunts");
    
    if (!sheet) {
      return "La feuille Emprunts n'existe pas";
    }
    
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    if (lastRow <= 1) {
      return "La feuille Emprunts existe mais ne contient que les en-têtes (pas de données)";
    }
    
    const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    const data = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
    
    return {
      message: `La feuille Emprunts contient ${lastRow - 1} lignes de données`,
      headers: headers,
      rowCount: lastRow - 1,
      firstRow: data[0]
    };
  } catch (error) {
    return "Erreur lors du diagnostic: " + error.toString();
  }
}
// Fonction pour diagnostiquer et forcer l'ajout de données
function forceAddTestEmprunts() {
  try {
    Logger.log("Début de forceAddTestEmprunts");
    const spreadsheet = getSpreadsheet();
    let sheet = spreadsheet.getSheetByName("Emprunts");
    
    // Si la feuille n'existe pas, la créer
    if (!sheet) {
      Logger.log("La feuille 'Emprunts' n'existe pas, création en cours...");
      sheet = spreadsheet.insertSheet("Emprunts");
    }
    
    // Effacer le contenu existant pour repartir de zéro
    Logger.log("Effacement du contenu existant");
    sheet.clear();
    
    // Définir les en-têtes
    const headers = ["ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", "Secteur", "Référent", "Emprunteur", "Statut", "Date création", "Notes"];
    Logger.log("Ajout des en-têtes: " + headers.join(", "));
    sheet.appendRow(headers);
    
    // Créer des données de test avec des ID uniques
    const testEmprunts = [
      {
        ID: Utilities.getUuid(),
        "Nom Manipulation": "Animation Astronomie TEST",
        "Lieu": "Collège Jean Moulin",
        "Date départ": "01/03/2025",
        "Date retour": "15/03/2025",
        "Secteur": "Astronomie",
        "Référent": "Thomas Durand",
        "Emprunteur": "Marie Dupont",
        "Statut": "Pas prêt",
        "Date création": new Date().toLocaleDateString("fr-FR"),
        "Notes": "Forcé par code"
      },
      {
        ID: Utilities.getUuid(),
        "Nom Manipulation": "Atelier Robotique TEST",
        "Lieu": "École Primaire Voltaire",
        "Date départ": "10/03/2025",
        "Date retour": "12/03/2025",
        "Secteur": "Robotique",
        "Référent": "Sophie Martin",
        "Emprunteur": "Sophie Martin",
        "Statut": "Prêt",
        "Date création": new Date().toLocaleDateString("fr-FR"),
        "Notes": "Forcé par code"
      },
      {
        ID: Utilities.getUuid(),
        "Nom Manipulation": "Exposition Biodiversité TEST",
        "Lieu": "Médiathèque Centrale",
        "Date départ": "15/02/2025",
        "Date retour": "28/02/2025",
        "Secteur": "Environnement",
        "Référent": "Lucas Bernard",
        "Emprunteur": "Julie Petit",
        "Statut": "Revenu",
        "Date création": new Date().toLocaleDateString("fr-FR"),
        "Notes": "Forcé par code"
      }
    ];
    
    // Ajouter directement chaque emprunt sans vérifications
    Logger.log("Ajout de " + testEmprunts.length + " emprunts");
    let addedCount = 0;
    testEmprunts.forEach(emprunt => {
      const rowArray = headers.map(header => emprunt[header] || '');
      sheet.appendRow(rowArray);
      addedCount++;
    });
    
    // Forcer la récupération après l'ajout
    SpreadsheetApp.flush();
    
    // Vérifier l'ajout
    const lastRow = sheet.getLastRow();
    Logger.log("Nombre de lignes après ajout: " + lastRow);
    
    // Vérification supplémentaire
    const checkData = sheet.getDataRange().getValues();
    Logger.log("Vérification - Nombre de lignes récupérées: " + checkData.length);
    
    return {
      success: true,
      message: `${addedCount} emprunts de test forcés avec succès`,
      rowCount: lastRow - 1, // Nombre de lignes moins les en-têtes
      sheetInfo: {
        name: sheet.getName(),
        rows: sheet.getLastRow(),
        columns: sheet.getLastColumn()
      },
      firstRowSample: checkData.length > 1 ? JSON.stringify(checkData[1]) : "Pas de données"
    };
  } catch (error) {
    Logger.log("Erreur dans forceAddTestEmprunts: " + error);
    return {
      success: false,
      error: error.toString(),
      message: "Erreur lors de l'ajout forcé des emprunts de test"
    };
  }
}
// Fonction simplifiée pour lister tous les emprunts
function listAllEmprunts() {
  try {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Emprunts");
    
    // Si la feuille n'existe pas, retourner un résultat vide
    if (!sheet) {
      return { emprunts: [] };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return { emprunts: [] };
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const emprunts = rows.map(row => {
      const emprunt = {};
      headers.forEach((header, index) => {
        emprunt[header] = row[index];
      });
      return emprunt;
    });
    
    return { emprunts: emprunts };
  } catch (error) {
    return { error: error.toString(), emprunts: [] };
  }
}
