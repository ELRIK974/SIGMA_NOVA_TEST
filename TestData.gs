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
// Vérifier l'état de la feuille "Emprunts"
function checkEmpruntsSheet() {
  const sheet = getSheetByName("Emprunts");
  
  if (!sheet) {
    console.error("La feuille 'Emprunts' n'existe pas");
    return {
      exists: false,
      message: "La feuille 'Emprunts' n'existe pas"
    };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  return {
    exists: true,
    headers: headers,
    rowCount: sheet.getLastRow(),
    message: "La feuille 'Emprunts' existe avec " + (sheet.getLastRow() - 1) + " lignes de données"
  };
}
// Fonction complète pour préparer la feuille Emprunts et ajouter des données de test
function prepareEmpruntsData() {
  try {
    // 1. Vérifier si la feuille existe, sinon la créer
    let sheet = getSheetByName("Emprunts");
    let message = "";
    
    if (!sheet) {
      message += "La feuille 'Emprunts' n'existe pas. Création... ";
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Emprunts");
      
      // Définir les en-têtes
      const headers = ["ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", "Secteur", "Référent", "Emprunteur", "Statut", "Date création"];
      sheet.appendRow(headers);
      
      // Formater la première ligne (en-têtes)
      sheet.getRange(1, 1, 1, headers.length).setBackground('#f3f3f3').setFontWeight('bold');
      
      message += "Feuille créée avec succès. ";
    } else {
      message += "La feuille 'Emprunts' existe déjà. ";
    }
    
    // 2. Ajouter des données de test si la feuille est vide ou ne contient que les en-têtes
    if (sheet.getLastRow() <= 1) {
      message += "Aucune donnée trouvée. Ajout de données de test... ";
      
      // Données de test à ajouter
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
      
      // Récupérer les en-têtes
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // Ajouter chaque emprunt de test
      testEmprunts.forEach(emprunt => {
        // Créer un tableau dans le même ordre que les en-têtes
        const rowArray = headers.map(header => emprunt[header] || '');
        
        // Ajouter la ligne
        sheet.appendRow(rowArray);
      });
      
      message += `${testEmprunts.length} emprunts de test ajoutés avec succès.`;
    } else {
      message += `Des données existent déjà (${sheet.getLastRow() - 1} emprunts trouvés).`;
    }
    
    return {
      success: true,
      message: message,
      rowCount: sheet.getLastRow() - 1
    };
  } catch (error) {
    console.error("Erreur dans prepareEmpruntsData:", error);
    return {
      success: false,
      message: "Erreur: " + error.toString()
    };
  }
}
