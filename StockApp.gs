// Cette fonction était précédemment nommée "doGet"
function doGetStandalone() {
  return HtmlService.createTemplateFromFile('stockStandalone')
    .evaluate()
    .setTitle('SIGMA - État des Stocks')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Fonction pour accéder à la version autonome (si besoin)
function getStandaloneURL() {
  return ScriptApp.getService().getUrl() + '?standalone=true';
}

// Fonction pour tester si la connexion à la feuille de calcul fonctionne
function testSpreadsheetConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1hdj86LiRWY7K1vIHYh0NwIM8M_HKEy7P9SGezhDC70M');
    const sheet = spreadsheet.getSheetByName('Stock');
    
    if (!sheet) {
      return {
        success: false,
        message: "La feuille 'Stock' n'existe pas dans le classeur",
        spreadsheetName: spreadsheet.getName()
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    return {
      success: true,
      message: "Connexion réussie",
      rowCount: data.length,
      headers: data[0],
      spreadsheetName: spreadsheet.getName()
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur de connexion: " + error.toString(),
      error: error.toString()
    };
  }
}

// Fonction simplifiée pour obtenir tous les articles du stock
function getStockItems() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1hdj86LiRWY7K1vIHYh0NwIM8M_HKEy7P9SGezhDC70M');
    const sheet = spreadsheet.getSheetByName('Stock');
    
    if (!sheet) {
      return {
        success: false,
        message: "La feuille 'Stock' n'existe pas"
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: true,
        message: "Aucun article trouvé",
        items: []
      };
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const items = rows.map(row => {
      const item = {};
      headers.forEach((header, i) => {
        item[header] = row[i];
      });
      return item;
    });
    
    return {
      success: true,
      message: `${items.length} articles trouvés`,
      items: items
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la récupération des articles: " + error.toString(),
      error: error.toString()
    };
  }
}

// Fonction pour ajouter un article de test
function addTestItem() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1hdj86LiRWY7K1vIHYh0NwIM8M_HKEy7P9SGezhDC70M');
    const sheet = spreadsheet.getSheetByName('Stock');
    
    if (!sheet) {
      // Créer la feuille si elle n'existe pas
      const newSheet = spreadsheet.insertSheet('Stock');
      newSheet.appendRow(["ID", "Nom", "Catégorie", "Quantité", "Seuil alerte", "Localisation", "Référence fournisseur", "Lien fournisseur"]);
      sheet = newSheet;
    }
    
    // Vérifier si les en-têtes existent
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (headers.length === 0 || headers[0] === "") {
      sheet.appendRow(["ID", "Nom", "Catégorie", "Quantité", "Seuil alerte", "Localisation", "Référence fournisseur", "Lien fournisseur"]);
    }
    
    // Générer un ID unique
    const id = Utilities.getUuid();
    
    // Créer une ligne pour l'article de test
    const testItem = [
      id,
      "Article Test " + new Date().toLocaleTimeString(),
      "Consommable",
      10,
      5,
      "Stock Principal",
      "TEST-001",
      ""
    ];
    
    // Ajouter l'article
    sheet.appendRow(testItem);
    
    return {
      success: true,
      message: "Article de test ajouté avec succès",
      id: id
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de l'ajout de l'article de test: " + error.toString(),
      error: error.toString()
    };
  }
}
