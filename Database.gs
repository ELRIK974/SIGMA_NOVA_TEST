/**
 * SIGMA - Fonctions d'accès à la base de données
 * Ce fichier contient toutes les fonctions pour lire et écrire dans les feuilles Google Sheets
 */

// Variables globales pour le cache
let spreadsheetInstance = null;
const sheetCache = {};
let dataCache = {};

/**
 * Obtenir le classeur (spreadsheet) avec mise en cache
 */
function getSpreadsheet() {
  try {
    // Réutiliser l'instance si elle existe déjà
    if (spreadsheetInstance === null) {
      console.log("Ouverture nouvelle instance de SpreadSheet");
      spreadsheetInstance = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    }
    return spreadsheetInstance;
  } catch (e) {
    console.error(`Erreur lors de l'ouverture du classeur: ${e.message}`);
    spreadsheetInstance = null; // Réinitialiser en cas d'erreur
    throw new Error(`Impossible d'accéder à la base de données. Vérifiez l'ID et vos permissions.`);
  }
}

/**
 * Obtenir une feuille par son nom avec mise en cache
 */
function getSheetByName(sheetName) {
  try {
    // Vérifier si la feuille est en cache
    if (!sheetCache[sheetName]) {
      const sheet = getSpreadsheet().getSheetByName(sheetName);
      if (!sheet) {
        console.error(`La feuille "${sheetName}" n'existe pas.`);
        return null;
      }
      sheetCache[sheetName] = sheet;
    }
    return sheetCache[sheetName];
  } catch (e) {
    console.error(`Erreur lors de l'accès à la feuille "${sheetName}": ${e.message}`);
    delete sheetCache[sheetName]; // Supprimer du cache en cas d'erreur
    return null;
  }
}

/**
 * Fonction pour invalider le cache si nécessaire
 */
function clearSheetCache(sheetName = null) {
  if (sheetName) {
    delete sheetCache[sheetName];
    delete dataCache[sheetName];
  } else {
    // Vider tout le cache
    Object.keys(sheetCache).forEach(key => delete sheetCache[key]);
    Object.keys(dataCache).forEach(key => delete dataCache[key]);
  }
  // Réinitialiser également l'instance de SpreadSheet
  spreadsheetInstance = null;
}

/**
 * Récupère les données en une seule opération puis met en cache
 * le résultat pour accélérer les filtres et la pagination
 */
function getAllDataCached(sheetName, forceRefresh = false) {
  if (!dataCache[sheetName] || forceRefresh) {
    dataCache[sheetName] = {
      timestamp: Date.now(),
      data: getAllData(sheetName)
    };
  }
  return dataCache[sheetName].data;
}

/**
 * Invalide le cache de données après une modification
 */
function invalidateDataCache(sheetName) {
  delete dataCache[sheetName];
}

/**
 * Obtenir toutes les données d'une feuille (avec en-têtes)
 */
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

/**
 * Fonction générique pour les opérations d'écriture avec invalidation du cache
 */
function performWriteOperation(sheetName, operation) {
  try {
    const result = operation();
    invalidateDataCache(sheetName);
    return result;
  } catch (error) {
    console.error(`Erreur lors de l'opération d'écriture dans "${sheetName}": ${error.message}`);
    throw error;
  }
}

/**
 * Ajouter une ligne de données dans une feuille
 */
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

/**
 * Mettre à jour une ligne en utilisant un ID ou une autre colonne comme identifiant
 */
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

/**
 * Supprimer une ligne par ID
 */
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

/**
 * Fonction générique pour la pagination et le filtrage des données
 */
function getPagedFilteredData(sheetName, page, pageSize, filterFn = null, sortFn = null) {
  try {
    // Récupérer les données complètes (en utilisant le cache si disponible)
    let allItems = getAllDataCached(sheetName);
    
    // Appliquer le filtre si spécifié
    let filteredItems = allItems;
    if (typeof filterFn === 'function') {
      filteredItems = allItems.filter(filterFn);
    }
    
    // Appliquer le tri si spécifié
    if (typeof sortFn === 'function') {
      filteredItems.sort(sortFn);
    }
    
    // Calculer la pagination
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (validPage - 1) * pageSize;
    
    // Extraire la page demandée
    const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);
    
    return {
      items: paginatedItems,
      pagination: {
        currentPage: validPage,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages
      }
    };
  } catch (error) {
    console.error(`Erreur dans getPagedFilteredData(${sheetName}): ${error.message}`);
    return {
      items: [],
      pagination: {
        currentPage: 1,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 1
      }
    };
  }
}

/**
 * Vérifie si une feuille existe et la crée si nécessaire avec les en-têtes spécifiés
 */
function ensureSheetExists(sheetName, headers) {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    console.log(`Création de la feuille manquante: ${sheetName}`);
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Ajouter les en-têtes
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      
      // Mettre en forme les en-têtes (optionnel)
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#f3f3f3')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
    }
  }
  
  return sheet;
}

/**
 * Fonction pour générer un ID unique
 */
function generateUniqueId() {
  return Utilities.getUuid();
}
