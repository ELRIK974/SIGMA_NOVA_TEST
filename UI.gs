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
  let content = '';
  
  switch(pageName) {
    case 'dashboard':
      content = HtmlService.createTemplateFromFile('dashboardUI').evaluate().getContent();
      break;
    case 'emprunts':
      // Corriger le nom du fichier pour qu'il corresponde au fichier réel
      content = HtmlService.createTemplateFromFile('empruntsUI').evaluate().getContent();
      break;
    case 'stock':
      content = HtmlService.createTemplateFromFile('stockUI').evaluate().getContent();
      break;
    case 'modules':
      content = HtmlService.createTemplateFromFile('modulesUI').evaluate().getContent();
      break;
    case 'livraisons':
      content = HtmlService.createTemplateFromFile('livraisonsUI').evaluate().getContent();
      break;
    case 'options':
      content = HtmlService.createTemplateFromFile('optionsUI').evaluate().getContent();
      break;
    default:
      // Par défaut, retourner la page dashboard
      content = HtmlService.createTemplateFromFile('dashboardUI').evaluate().getContent();
  }
  
  return content;
}

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

// Obtenir les données pour la page Emprunts avec pagination
function getEmpruntsPageData(page, pageSize, filterStatus, searchTerm) {
  try {
    // Conversion et validation des paramètres
    page = Math.max(1, parseInt(page) || 1);
    pageSize = Math.max(1, parseInt(pageSize) || 10);
    
    // Récupération des données avec traçage
    console.log("Début getEmpruntsPageData - récupération des emprunts");
    let emprunts = [];
    
    try {
      emprunts = getAllEmprunts();
      console.log(`getAllEmprunts a retourné ${emprunts.length} éléments`);
      
      if (!Array.isArray(emprunts)) {
        console.error("getAllEmprunts n'a pas retourné un tableau:", emprunts);
        emprunts = [];
      }
    } catch (err) {
      console.error("Erreur dans getAllEmprunts:", err);
      emprunts = [];
    }
    
    // Création d'un filtre robuste
    const filteredEmprunts = emprunts.filter(emp => {
      if (!emp) return false;
      
      // Filtre par statut
      if (filterStatus && filterStatus !== 'Tous') {
        if (emp.Statut !== filterStatus) return false;
      }
      
      // Filtre par recherche
      if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        const nomMatch = emp["Nom Manipulation"] && 
                        emp["Nom Manipulation"].toString().toLowerCase().includes(term);
        const empMatch = emp.Emprunteur && 
                        emp.Emprunteur.toString().toLowerCase().includes(term);
        
        if (!nomMatch && !empMatch) return false;
      }
      
      return true;
    });
    
    console.log(`Après filtrage: ${filteredEmprunts.length} emprunts`);
    
    // Calcul de la pagination
    const totalItems = filteredEmprunts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const validPage = Math.min(page, totalPages);
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedItems = filteredEmprunts.slice(startIndex, endIndex);
    
    console.log(`Pagination: page ${validPage}/${totalPages}, éléments ${startIndex}-${endIndex}/${totalItems}`);
    
    // Construction du résultat avec structure garantie
    const result = {
      emprunts: paginatedItems,
      pagination: {
        currentPage: validPage,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages
      }
    };
    
    console.log("Fin getEmpruntsPageData - résultat:", result);
    return result;
  } catch (error) {
    console.error("Erreur globale dans getEmpruntsPageData:", error);
    // Retourner une structure valide même en cas d'erreur
    return {
      emprunts: [],
      pagination: {
        currentPage: 1,
        pageSize: pageSize || 10,
        totalItems: 0,
        totalPages: 1
      }
    };
  }
}
/// Sauvegarder un emprunt (nouveau ou existant)
function saveEmpruntFromUI(empruntData) {
  try {
    // Formater les dates si elles sont au format YYYY-MM-DD (format HTML input date)
    if (empruntData["Date départ"] && empruntData["Date départ"].includes('-')) {
      const parts = empruntData["Date départ"].split('-');
      empruntData["Date départ"] = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    
    if (empruntData["Date retour"] && empruntData["Date retour"].includes('-')) {
      const parts = empruntData["Date retour"].split('-');
      empruntData["Date retour"] = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    
    if (empruntData.ID) {
      // Mise à jour d'un emprunt existant
      return updateEmprunt(empruntData.ID, empruntData);
    } else {
      // Création d'un nouvel emprunt
      return createEmprunt(empruntData);
    }
  } catch (error) {
    console.error("Erreur dans saveEmpruntFromUI:", error);
    return null;
  }
}
// Obtenir un emprunt spécifique pour l'édition
function getEmpruntForEdit(id) {
  return getEmpruntById(id);
}

// Obtenir un emprunt spécifique pour la visualisation
function getEmpruntForView(id) {
  return getEmpruntById(id);
}
/**
 * Fonction de diagnostic spécifique pour la page Emprunts
 */
function diagnosticEmprunts() {
  try {
    // Vérifier l'accès à la feuille
    const sheet = getSheetByName("Emprunts");
    let sheetInfo = { exists: false };
    
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      sheetInfo = {
        exists: true,
        rowCount: data.length,
        headers: data.length > 0 ? data[0] : [],
        sample: data.length > 1 ? data.slice(1, Math.min(4, data.length)) : []
      };
    }
    
    // Tester la fonction getAllEmprunts
    let empruntsData;
    let error = null;
    
    try {
      empruntsData = getAllEmprunts();
    } catch (e) {
      error = e.toString();
    }
    
    // Tester addTestEmprunts
    let testResult;
    try {
      testResult = addTestEmprunts();
    } catch (e) {
      testResult = "Erreur: " + e.toString();
    }
    
    return {
      timeStamp: new Date().toISOString(),
      sheetInfo: sheetInfo,
      empruntsData: {
        type: typeof empruntsData,
        isArray: Array.isArray(empruntsData),
        length: Array.isArray(empruntsData) ? empruntsData.length : 0,
        firstItem: Array.isArray(empruntsData) && empruntsData.length > 0 ? empruntsData[0] : null,
        error: error
      },
      testResult: testResult
    };
  } catch (error) {
    return {
      error: error.toString(),
      stack: error.stack
    };
  }
}
/**
 * Fonction pour invalider le cache de données côté client
 */
function invalidateDataCache(sheetName) {
  try {
    // Appel à la fonction dans Database.gs
    if (typeof window.invalidateDataCache === 'function') {
      window.invalidateDataCache(sheetName);
    } else {
      // Si la fonction n'existe pas encore, on la crée
      delete dataCache[sheetName];
    }
    return {
      success: true,
      message: `Cache invalidé pour ${sheetName}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Erreur lors de l'invalidation du cache pour ${sheetName}:`, error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
