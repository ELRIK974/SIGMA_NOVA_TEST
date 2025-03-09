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
