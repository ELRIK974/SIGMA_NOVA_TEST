/**
 * SIGMA - Gestion des stocks
 * Ce fichier contient toutes les fonctions relatives à la gestion des stocks
 */

// Obtenir tous les articles du stock
function getAllStock() {
  try {
    return getAllData(CONFIG.SHEETS.STOCK);
  } catch (error) {
    console.error("Erreur dans getAllStock:", error);
    return [];
  }
}

// Obtenir les articles du stock avec pagination
// APRÈS
function getStockPaginated(page, pageSize, filterType, searchTerm) {
  // Utiliser la fonction générique avec des filtres spécifiques
  return getPagedFilteredData(
    CONFIG.SHEETS.STOCK,
    page,
    pageSize,
    item => {
      // Combiner tous les filtres en une seule fonction
      // 1. Filtre par type/catégorie
      let passesTypeFilter = true;
      if (filterType && filterType !== 'Tous') {
        if (filterType === 'Stock critique') {
          passesTypeFilter = Number(item.Quantité) <= Number(item["Seuil alerte"]);
        } else {
          passesTypeFilter = item.Catégorie === filterType;
        }
      }
      
      // 2. Filtre par terme de recherche
      let passesSearchFilter = true;
      if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        passesSearchFilter = (
          (item.Nom && item.Nom.toLowerCase().includes(term)) || 
          (item.Localisation && item.Localisation.toLowerCase().includes(term)) ||
          (item["Référence fournisseur"] && item["Référence fournisseur"].toLowerCase().includes(term))
        );
      }
      
      // L'item doit passer tous les filtres
      return passesTypeFilter && passesSearchFilter;
    }
  );
}

// Créer un nouvel article
// APRÈS
function createStockItem(itemData) {
  return performWriteOperation(CONFIG.SHEETS.STOCK, () => {
    // Ajouter un ID unique
    itemData.ID = Utilities.getUuid();
    
    // Convertir les champs numériques
    if (itemData.Quantité) itemData.Quantité = Number(itemData.Quantité);
    if (itemData["Seuil alerte"]) itemData["Seuil alerte"] = Number(itemData["Seuil alerte"]);
    
    // Ajouter l'article à la feuille
    return addRow(CONFIG.SHEETS.STOCK, itemData);
  });
}

// Obtenir un article par son ID
function getStockItemById(id) {
  try {
    const items = getAllStock();
    return items.find(item => item.ID === id);
  } catch (error) {
    console.error("Erreur dans getStockItemById:", error);
    return null;
  }
}

// Mettre à jour un article
function updateStockItem(id, itemData) {
  return performWriteOperation(CONFIG.SHEETS.STOCK, () => {
    // Convertir les champs numériques
    if (itemData.Quantité) itemData.Quantité = Number(itemData.Quantité);
    if (itemData["Seuil alerte"]) itemData["Seuil alerte"] = Number(itemData["Seuil alerte"]);
    
    return updateRow(CONFIG.SHEETS.STOCK, "ID", id, itemData);
  });
}

// Supprimer un article
function deleteStockItem(id) {
  return performWriteOperation(CONFIG.SHEETS.STOCK, () => {
    return deleteRow(CONFIG.SHEETS.STOCK, "ID", id);
  });
}

// Exporter les données du stock au format CSV
function exportStockToCSV() {
  try {
    const items = getAllStock();
    
    // Définir les en-têtes
    const headers = ["ID", "Nom", "Catégorie", "Quantité", "Seuil alerte", "Localisation", "Référence fournisseur"];
    
    // Créer les lignes CSV
    let csvContent = headers.join(",") + "\n";
    
    items.forEach(item => {
      const row = [
        item.ID || "",
        item.Nom || "",
        item.Catégorie || "",
        item.Quantité || "",
        item["Seuil alerte"] || "",
        item.Localisation || "",
        item["Référence fournisseur"] || ""
      ].map(cell => `"${cell}"`).join(",");
      
      csvContent += row + "\n";
    });
    
    return csvContent;
  } catch (error) {
    console.error("Erreur dans exportStockToCSV:", error);
    return "";
  }
}

// Obtenir les catégories uniques d'articles
function getUniqueStockCategories() {
  try {
    const items = getAllStock();
    const categories = new Set();
    
    items.forEach(item => {
      if (item.Catégorie) {
        categories.add(item.Catégorie);
      }
    });
    
    return Array.from(categories);
  } catch (error) {
    console.error("Erreur dans getUniqueStockCategories:", error);
    return [];
  }
}

// Obtenir les localisations uniques des articles
function getUniqueStockLocations() {
  try {
    const items = getAllStock();
    const locations = new Set();
    
    items.forEach(item => {
      if (item.Localisation) {
        locations.add(item.Localisation);
      }
    });
    
    return Array.from(locations);
  } catch (error) {
    console.error("Erreur dans getUniqueStockLocations:", error);
    return [];
  }
}
