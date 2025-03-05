/**
 * SIGMA - Fonctions d'accès à la base de données
 * Ce fichier contient toutes les fonctions pour lire et écrire dans les feuilles Google Sheets
 */

// Obtenir le classeur (spreadsheet)
function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } catch (e) {
    console.error(`Erreur lors de l'ouverture du classeur: ${e.message}`);
    throw new Error(`Impossible d'accéder à la base de données. Vérifiez l'ID et vos permissions.`);
  }
}

// Obtenir une feuille par son nom
function getSheetByName(sheetName) {
  try {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      console.error(`La feuille "${sheetName}" n'existe pas.`);
      return null;
    }
    return sheet;
  } catch (e) {
    console.error(`Erreur lors de l'accès à la feuille "${sheetName}": ${e.message}`);
    return null;
  }
}

// Obtenir toutes les données d'une feuille (avec en-têtes)
function getAllData(sheetName) {
  const sheet = getSheetByName(sheetName);
  
  // Vérifier si la feuille existe
  if (!sheet) {
    console.error(`La feuille "${sheetName}" n'existe pas.`);
    return [];
  }
  
  try {
    const data = sheet.getDataRange().getValues();
    
    // Vérifier s'il y a des données (au moins la ligne d'en-tête)
    if (data.length === 0) {
      return [];
    }
    
    // Transformer les données en objets avec les en-têtes comme clés
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
  } catch (e) {
    console.error(`Erreur lors de la lecture des données de "${sheetName}": ${e.message}`);
    return [];
  }
}

// Ajouter une ligne de données dans une feuille
function addRow(sheetName, rowData) {
  const sheet = getSheetByName(sheetName);
  
  // Vérifier si la feuille existe
  if (!sheet) {
    console.error(`La feuille "${sheetName}" n'existe pas.`);
    return null;
  }
  
  try {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Créer un tableau dans le même ordre que les en-têtes
    const rowArray = headers.map(header => rowData[header] || '');
    
    // Ajouter la ligne
    sheet.appendRow(rowArray);
    return rowData;
  } catch (e) {
    console.error(`Erreur lors de l'ajout d'une ligne dans "${sheetName}": ${e.message}`);
    return null;
  }
}

// Mettre à jour une ligne en utilisant un ID ou une autre colonne comme identifiant
function updateRow(sheetName, idColumnName, idValue, updatedData) {
  const sheet = getSheetByName(sheetName);
  
  // Vérifier si la feuille existe
  if (!sheet) {
    console.error(`La feuille "${sheetName}" n'existe pas.`);
    return false;
  }
  
  try {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Trouver l'index de la colonne d'identification
    const idColumnIndex = headers.indexOf(idColumnName);
    if (idColumnIndex === -1) {
      console.error(`La colonne "${idColumnName}" n'existe pas dans la feuille "${sheetName}".`);
      return false;
    }
    
    // Chercher la ligne correspondante
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumnIndex] == idValue) {
        // Créer un tableau de valeurs mises à jour
        const updatedRow = headers.map((header, j) => {
          return updatedData.hasOwnProperty(header) ? updatedData[header] : data[i][j];
        });
        
        // Mettre à jour la ligne
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([updatedRow]);
        return true;
      }
    }
    
    console.warn(`Aucune ligne avec ${idColumnName}=${idValue} trouvée dans "${sheetName}".`);
    return false; // Ligne non trouvée
  } catch (e) {
    console.error(`Erreur lors de la mise à jour dans "${sheetName}": ${e.message}`);
    return false;
  }
}

// Supprimer une ligne par ID
function deleteRow(sheetName, idColumnName, idValue) {
  const sheet = getSheetByName(sheetName);
  
  // Vérifier si la feuille existe
  if (!sheet) {
    console.error(`La feuille "${sheetName}" n'existe pas.`);
    return false;
  }
  
  try {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Trouver l'index de la colonne d'identification
    const idColumnIndex = headers.indexOf(idColumnName);
    if (idColumnIndex === -1) {
      console.error(`La colonne "${idColumnName}" n'existe pas dans la feuille "${sheetName}".`);
      return false;
    }
    
    // Chercher la ligne correspondante
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumnIndex] == idValue) {
        sheet.deleteRow(i + 1);
        return true;
      }
    }
    
    console.warn(`Aucune ligne avec ${idColumnName}=${idValue} trouvée dans "${sheetName}".`);
    return false; // Ligne non trouvée
  } catch (e) {
    console.error(`Erreur lors de la suppression dans "${sheetName}": ${e.message}`);
    return false;
  }
}

// Fonction pour générer un ID unique
function generateUniqueId() {
  return Utilities.getUuid();
}
