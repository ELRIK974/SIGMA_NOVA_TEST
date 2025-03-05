/**
 * SIGMA - Fonctions liées à l'interface utilisateur
 * Ce fichier contient les fonctions appelées depuis le front-end
 */

// Obtenir les données pour l'onglet "Résumé"
function getDashboardData() {
  const data = {
    alertesStock: getAlertesStock(),
    materielManquant: getMaterielManquant(),
    empruntsNonRevenus: getEmpruntsNonRevenus(),
    prochainsEmprunts: getProchainsEmprunts(),
    modulesNonOperationnels: getModulesNonOperationnels(),
    materielNonOperationnel: getMaterielNonOperationnel(),
    empruntsEnAttente: getEmpruntsEnAttente()
  };
  
  return data;
}

// Fonction temporaire pour l'onglet "Résumé" (sera développée plus tard)
function getAlertesStock() {
  // Temporairement, retourner des données fictives
  return [
    { materiel: "Tablettes Android", stock: 2, seuil: 5, localisation: "Armoire A" },
    { materiel: "Câbles HDMI", stock: 3, seuil: 10, localisation: "Tiroir B" }
  ];
}

// Fonction temporaire pour le matériel manquant
function getMaterielManquant() {
  return [
    { materiel: "Adaptateur DisplayPort", quantite: 1, urgence: "Haute" },
    { materiel: "Batterie externe", quantite: 2, urgence: "Moyenne" }
  ];
}

// Fonction temporaire pour les emprunts non revenus
function getEmpruntsNonRevenus() {
  return [
    { 
      nom: "Animation Astronomie", 
      lieu: "Collège Jean Moulin",
      dateDepart: "01/02/2025",
      dateRetour: "15/02/2025",
      secteur: "Astronomie",
      emprunteur: "Marie Dupont"
    }
  ];
}

// Fonction temporaire pour les prochains emprunts
function getProchainsEmprunts() {
  return [
    { 
      nom: "Atelier Robotique", 
      dateDepart: "10/03/2025",
      etat: "Pas prêt"
    }
  ];
}

// Fonction temporaire pour les modules non opérationnels
function getModulesNonOperationnels() {
  return [
    { 
      code: "ASTRO-01", 
      nom: "Module Observation Lunaire",
      probleme: "Manque oculaire 10mm"
    }
  ];
}

// Fonction temporaire pour le matériel non opérationnel
function getMaterielNonOperationnel() {
  return [
    { 
      nom: "Télescope 150/750", 
      probleme: "Pied instable",
      statut: "En réparation"
    }
  ];
}

// Fonction temporaire pour les emprunts en attente
function getEmpruntsEnAttente() {
  return [
    { 
      nom: "Exposition Biodiversité", 
      dateRetour: "28/02/2025",
      statut: "Non inventorié, Non facturé"
    }
  ];
}

// Fonction pour récupérer le contenu HTML d'une page spécifique
function getPageContent(pageName) {
  switch(pageName) {
    case 'dashboard':
      return HtmlService.createHtmlOutputFromFile('dashboardUI').getContent();
    case 'emprunts':
      return HtmlService.createHtmlOutputFromFile('empruntsUI').getContent();
    case 'stock':
      return HtmlService.createHtmlOutputFromFile('stockUI').getContent();
    case 'modules':
      return HtmlService.createHtmlOutputFromFile('modulesUI').getContent();
    case 'livraisons':
      return HtmlService.createHtmlOutputFromFile('livraisonsUI').getContent();
    case 'options':
      return HtmlService.createHtmlOutputFromFile('optionsUI').getContent();
    default:
      // Par défaut, retourner la page dashboard
      return HtmlService.createHtmlOutputFromFile('dashboardUI').getContent();
  }
}

// Obtenir les données pour la page Stock
// Obtenir les données pour la page Stock
function getStockPageData(page, pageSize, filterType, searchTerm) {
  try {
    // Récupérer les articles paginés
    const stockData = getStockPaginated(page || 1, pageSize || 10, filterType, searchTerm);
    
    // Récupérer les catégories uniques pour le filtre
    const categories = getUniqueStockCategories();
    
    // Récupérer les localisations uniques pour l'auto-complétion
    const locations = getUniqueStockLocations();
    
    return {
      stockData: stockData,
      categories: categories,
      locations: locations
    };
  } catch (error) {
    console.error("Erreur dans getStockPageData:", error);
    return {
      stockData: { items: [], pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 } },
      categories: [],
      locations: []
    };
  }
}

// Obtenir un article spécifique pour l'édition
function getStockItemForEdit(id) {
  return getStockItemById(id);
}

// Sauvegarder un article (nouveau ou existant)
function saveStockItem(itemData) {
  if (itemData.ID) {
    // Mise à jour d'un article existant
    return updateStockItem(itemData.ID, itemData);
  } else {
    // Création d'un nouvel article
    return createStockItem(itemData);
  }
}

// Supprimer un article
function deleteStockItemFromUI(id) {
  return deleteStockItem(id);
}

// Obtenir le fichier CSV du stock pour export
function getStockCSVExport() {
  return exportStockToCSV();
}
// Obtenir les données pour la page Emprunts
// Obtenir les données pour la page Emprunts
function getEmpruntsPageData(page, pageSize, filterType) {
  try {
    console.log("Exécution de getEmpruntsPageData avec:", page, pageSize, filterType);
    
    // Récupérer tous les emprunts
    const allEmprunts = getAllEmprunts();
    console.log("Emprunts récupérés:", allEmprunts.length);
    
    // Filtrer les emprunts si un type de filtre est spécifié
    let filteredEmprunts = allEmprunts;
    if (filterType && filterType !== 'Tous') {
      filteredEmprunts = allEmprunts.filter(emp => emp.Statut === filterType);
    }
    
    // Calculer la pagination
    const totalEmprunts = filteredEmprunts.length;
    const totalPages = Math.ceil(totalEmprunts / pageSize) || 1; // Au moins 1 page
    const validPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (validPage - 1) * pageSize;
    
    // Extraire les emprunts pour la page demandée
    const paginatedEmprunts = filteredEmprunts.slice(startIndex, startIndex + pageSize);
    
    const result = {
      emprunts: paginatedEmprunts,
      pagination: {
        currentPage: validPage,
        pageSize: pageSize,
        totalItems: totalEmprunts,
        totalPages: totalPages
      }
    };
    
    console.log("Résultat de getEmpruntsPageData:", result);
    return result;
  } catch (error) {
    console.error("Erreur dans getEmpruntsPageData:", error);
    return {
      emprunts: [],
      pagination: {
        currentPage: 1,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 1
      }
    };
  }
}

// Supprimer un emprunt (fonction d'interface)
function deleteEmpruntFromUI(id) {
  return deleteEmprunt(id);
}
