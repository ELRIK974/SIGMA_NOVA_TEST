/**
 * SIGMA - Fonctions de diagnostic système
 * Ce fichier contient les fonctions pour diagnostiquer et réparer l'application
 */

/**
 * Vérifie l'état du système et renvoie un diagnostic
 */
function checkSystemStatus() {
  try {
    const result = {
      timestamp: new Date().toISOString(),
      spreadsheet: {
        success: false,
        message: "Non testé"
      },
      sheets: {},
      user: {
        email: Session.getActiveUser().getEmail(),
        effectiveUser: Session.getEffectiveUser().getEmail()
      }
    };
    
    // Vérifier l'accès au classeur
    try {
      const spreadsheet = getSpreadsheet();
      result.spreadsheet = {
        success: true,
        name: spreadsheet.getName(),
        id: spreadsheet.getId(),
        url: spreadsheet.getUrl()
      };
    } catch (e) {
      result.spreadsheet = {
        success: false,
        message: e.message
      };
      return result; // Arrêter le diagnostic si on ne peut pas accéder au classeur
    }
    
    // Vérifier chaque feuille importante
    ["Stock", "Emprunts", "Modules"].forEach(sheetName => {
      try {
        const sheet = getSheetByName(sheetName);
        if (sheet) {
          const data = sheet.getDataRange().getValues();
          result.sheets[sheetName] = {
            exists: true,
            rowCount: data.length,
            columnCount: data.length > 0 ? data[0].length : 0,
            hasHeaders: data.length > 0,
            hasData: data.length > 1
          };
          
          if (data.length > 0) {
            result.sheets[sheetName].headers = data[0];
          }
        } else {
          result.sheets[sheetName] = {
            exists: false,
            message: "Feuille non trouvée"
          };
        }
      } catch (e) {
        result.sheets[sheetName] = {
          exists: false,
          error: e.message
        };
      }
    });
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

/**
 * Initialise ou répare l'application complète
 */
function initializeApplication() {
  try {
    // Vérifie et crée les feuilles nécessaires avec leurs en-têtes
    const stockHeaders = ["ID", "Nom", "Catégorie", "Quantité", "Seuil alerte", "Localisation", "Référence fournisseur", "Lien fournisseur"];
    const stockSheet = ensureSheetExists("Stock", stockHeaders);
    
    const empruntsHeaders = ["ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", "Secteur", "Référent", "Emprunteur", "Statut", "Date création", "Notes"];
    const empruntsSheet = ensureSheetExists("Emprunts", empruntsHeaders);
    
    const modulesHeaders = ["Code", "Nom", "Secteur", "Statut", "Localisation", "Date création", "Notes"];
    const modulesSheet = ensureSheetExists("Modules", modulesHeaders);
    
    // Ajouter des données de test si nécessaire
    let dataAdded = false;
    
    // Vérifier si les données de test doivent être ajoutées
    const stockData = stockSheet.getDataRange().getValues();
    if (stockData.length <= 1) { // Seulement les en-têtes
      try {
        initializeTestData();
        dataAdded = true;
      } catch (e) {
        console.error("Erreur lors de l'ajout des données de test pour Stock:", e);
      }
    }
    
    const empruntsData = empruntsSheet.getDataRange().getValues();
    if (empruntsData.length <= 1) { // Seulement les en-têtes
      try {
        addTestEmprunts();
        dataAdded = true;
      } catch (e) {
        console.error("Erreur lors de l'ajout des données de test pour Emprunts:", e);
      }
    }
    
    // Vider tous les caches après initialisation
    clearSheetCache();
    
    // Récupérer un diagnostic après initialisation
    const diagnostic = checkSystemStatus();
    
    return {
      success: true,
      message: "Application SIGMA initialisée avec succès" + (dataAdded ? " avec données de test." : "."),
      dataAdded: dataAdded,
      diagnostic: diagnostic
    };
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    return {
      success: false,
      message: "Erreur lors de l'initialisation: " + error.message,
      error: error.message
    };
  }
}
