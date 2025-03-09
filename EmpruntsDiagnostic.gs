/**
 * SIGMA - Fonctions de diagnostic pour les emprunts
 */

// Vérification complète du système d'emprunts
function checkEmpruntSystem() {
  const result = {
    success: false,
    steps: [],
    data: null
  };
  
  try {
    // 1. Vérifier si le spreadsheet existe
    result.steps.push("Vérification de l'accès au classeur");
    const spreadsheet = getSpreadsheet();
    if (!spreadsheet) {
      result.steps.push("ERREUR: Impossible d'accéder au classeur");
      return result;
    }
    
    // 2. Vérifier si la feuille Emprunts existe
    result.steps.push("Vérification de la feuille Emprunts");
    let sheet = spreadsheet.getSheetByName("Emprunts");
    
    // 3. Si la feuille n'existe pas, la créer et ajouter des données de test
    if (!sheet) {
      result.steps.push("La feuille Emprunts n'existe pas - Création en cours");
      sheet = spreadsheet.insertSheet("Emprunts");
      
      // Ajouter les en-têtes
      const headers = [
        "ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", 
        "Secteur", "Référent", "Emprunteur", "Statut", "Date création", "Notes"
      ];
      sheet.appendRow(headers);
      result.steps.push("En-têtes ajoutés");
      
      // Ajouter des données de test
      result.steps.push("Ajout des données de test");
      addTestEntries(sheet, headers);
      
      // Forcer la mise à jour
      SpreadsheetApp.flush();
      result.steps.push("Données de test ajoutées avec succès");
    } else {
      result.steps.push("La feuille Emprunts existe");
    }
    
    // 4. Vérifier si la feuille contient des données
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      result.steps.push("Aucune donnée trouvée dans la feuille - Ajout de données de test");
      
      // Ajouter des données de test
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      addTestEntries(sheet, headers);
      
      // Forcer la mise à jour
      SpreadsheetApp.flush();
      result.steps.push("Données de test ajoutées avec succès");
    } else {
      result.steps.push(`${lastRow - 1} lignes de données trouvées`);
    }
    
    // 5. Vérifier que les données sont lisibles
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    if (rows.length === 0) {
      result.steps.push("ERREUR: Impossible de lire les données");
      return result;
    }
    
    // 6. Essayer de lire un emprunt spécifique
    const sampleEmprunt = {};
    headers.forEach((header, index) => {
      sampleEmprunt[header] = rows[0][index];
    });
    
    result.steps.push("Lecture d'échantillon réussie");
    result.data = sampleEmprunt;
    result.success = true;
    
    return result;
  } catch (error) {
    result.steps.push(`ERREUR: ${error.toString()}`);
    return result;
  }
}

// Fonction pour ajouter des entrées de test à une feuille existante
function addTestEntries(sheet, headers) {
  // Créer des données de test
  const testEmprunts = [
    {
      ID: Utilities.getUuid(),
      "Nom Manipulation": "Animation Astronomie DIAGNOSTIC",
      "Lieu": "Collège Jean Moulin",
      "Date départ": "01/03/2025",
      "Date retour": "15/03/2025",
      "Secteur": "Astronomie",
      "Référent": "Thomas Durand",
      "Emprunteur": "Marie Dupont",
      "Statut": "Pas prêt",
      "Date création": new Date().toLocaleDateString("fr-FR"),
      "Notes": "Ajouté par diagnostic"
    },
    {
      ID: Utilities.getUuid(),
      "Nom Manipulation": "Atelier Robotique DIAGNOSTIC",
      "Lieu": "École Primaire Voltaire",
      "Date départ": "10/03/2025",
      "Date retour": "12/03/2025",
      "Secteur": "Robotique",
      "Référent": "Sophie Martin",
      "Emprunteur": "Sophie Martin",
      "Statut": "Prêt",
      "Date création": new Date().toLocaleDateString("fr-FR"),
      "Notes": "Ajouté par diagnostic"
    },
    {
      ID: Utilities.getUuid(),
      "Nom Manipulation": "Exposition Biodiversité DIAGNOSTIC",
      "Lieu": "Médiathèque Centrale",
      "Date départ": "15/02/2025",
      "Date retour": "28/02/2025",
      "Secteur": "Environnement",
      "Référent": "Lucas Bernard",
      "Emprunteur": "Julie Petit",
      "Statut": "Revenu",
      "Date création": new Date().toLocaleDateString("fr-FR"),
      "Notes": "Ajouté par diagnostic"
    }
  ];
  
  // Ajouter chaque emprunt
  testEmprunts.forEach(emprunt => {
    const rowArray = headers.map(header => emprunt[header] || '');
    sheet.appendRow(rowArray);
  });
  
  return testEmprunts.length;
}

// Fonction pour lister tous les emprunts de façon simple
function listAllEmprunts() {
  try {
    const spreadsheet = getSpreadsheet();
    if (!spreadsheet) return "Erreur: Impossible d'accéder au classeur";
    
    const sheet = spreadsheet.getSheetByName("Emprunts");
    if (!sheet) return "Erreur: La feuille Emprunts n'existe pas";
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return "La feuille ne contient aucune donnée";
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Convertir en objets simples
    const emprunts = rows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    return {
      count: emprunts.length,
      emprunts: emprunts
    };
  } catch (error) {
    return "Erreur: " + error.toString();
  }
}

// Fonction pour récupérer les données d'emprunts de façon simplifiée
function getSimpleEmpruntsData() {
  try {
    const spreadsheet = getSpreadsheet();
    if (!spreadsheet) return { error: "Impossible d'accéder au classeur" };
    
    const sheet = spreadsheet.getSheetByName("Emprunts");
    if (!sheet) return { error: "La feuille Emprunts n'existe pas" };
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { error: "Aucune donnée dans la feuille" };
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Convertir en objets simples
    const emprunts = rows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    return {
      success: true,
      emprunts: emprunts,
      pagination: {
        currentPage: 1,
        pageSize: emprunts.length,
        totalItems: emprunts.length,
        totalPages: 1
      }
    };
  } catch (error) {
    return { 
      error: error.toString(),
      success: false,
      emprunts: []
    };
  }
}
