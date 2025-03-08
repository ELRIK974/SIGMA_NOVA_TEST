/**
 * SIGMA - Système Informatique de Gestion du MAtériel
 * Point d'entrée principal de l'application
 */

// Fonction exécutée lorsque la Web App est ouverte
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('SIGMA - Gestion du Matériel')
    .setFaviconUrl('https://www.gstatic.com/script/apps_script_1x.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fonction pour inclure des fichiers HTML partiels
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Fonction pour obtenir l'URL de déploiement de la Web App
function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

// Fonction pour obtenir l'email de l'utilisateur actuel
function getUserEmail() {
  return Session.getActiveUser().getEmail();
}
/**
 * Vérifie si l'utilisateur a accès à l'application
 * @returns {boolean} Vrai si l'utilisateur a accès
 */
function checkUserAccess() {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail();
    
    // Si l'email est vide, l'utilisateur n'est pas connecté
    if (!email) {
      return false;
    }
    
    // TODO: Implémenter des règles d'accès plus complexes si nécessaire
    // Par exemple, vérifier si l'email appartient à un domaine spécifique
    // ou si l'utilisateur figure dans une liste d'utilisateurs autorisés
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la vérification des accès:", error);
    return false;
  }
}

// Modifier la fonction doGet pour vérifier l'accès
function doGet() {
  // Vérifier si l'utilisateur a accès
  if (!checkUserAccess()) {
    return HtmlService.createHtmlOutput(
      '<h1>Accès refusé</h1>' +
      '<p>Vous n\'avez pas les permissions nécessaires pour accéder à cette application.</p>' +
      '<p>Veuillez contacter l\'administrateur ou vous connecter avec un compte autorisé.</p>'
    )
    .setTitle('SIGMA - Accès refusé');
  }
  
  // L'utilisateur a accès, retourner l'application
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('SIGMA - Gestion du Matériel')
    .setFaviconUrl('https://www.gstatic.com/script/apps_script_1x.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
/**
 * Initialise les structures de base de données et ajoute des données de test
 * Fonction utilitaire à exécuter une fois pour configurer le système
 */
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

/**
 * Vérifie si une feuille existe et la crée si nécessaire avec les en-têtes spécifiés
 * @param {string} sheetName - Nom de la feuille à vérifier/créer
 * @param {Array} headers - Tableau des en-têtes de colonnes
 * @returns {Sheet} La feuille de calcul
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
 * Fonction simple pour tester la communication client-serveur
 */
function pingServer() {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    message: "Connexion au serveur établie avec succès"
  };
}
