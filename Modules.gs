/**
 * SIGMA - Gestion des modules
 * Ce fichier contient toutes les fonctions relatives à la gestion des modules
 */

// Obtenir tous les modules
function getAllModules() {
  return getAllData("Modules");
}

// Créer un nouveau module
function createModule(moduleData) {
  // Ajouter des champs automatiques si nécessaire
  if (!moduleData.Statut) {
    moduleData.Statut = "Pas prêt";
  }
  
  // Ajouter le module à la feuille
  return addRow("Modules", moduleData);
}

// Obtenir un module par son code
function getModuleByCode(code) {
  const modules = getAllModules();
  return modules.find(mod => mod.Code === code);
}

// Mettre à jour le statut d'un module
function updateModuleStatus(code, newStatus) {
  return updateRow("Modules", "Code", code, { Statut: newStatus });
}

// Obtenir tous les modules non opérationnels
function getNonOperationalModules() {
  const modules = getAllModules();
  return modules.filter(mod => mod.Statut === "Pas prêt");
}
