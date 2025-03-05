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
function getStockPaginated(page, pageSize, filterType, searchTerm) {
  try {
    const allItems = getAllStock();
    let filteredItems = allItems;
    
    // Appliquer le filtre par type/catégorie si spécifié
    if (filterType && filterType !== 'Tous') {
      if (filterType === 'Stock critique') {
        // Filtre spécial pour les articles en stock critique
        filteredItems = filteredItems.filter(item => 
          Number(item.Quantité) <= Number(item["Seuil alerte"])
        );
      } else {
        // Filtre normal par catégorie
        filteredItems = filteredItems.filter(item => item.Catégorie === filterType);
      }
    }
    
    // Appliquer le filtre de recherche si spécifié
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filteredItems = filteredItems.filter(item => {
        // Recherche dans plusieurs champs pour plus d'efficacité
        return (
          (item.Nom && item.Nom.toLowerCase().includes(term)) || 
          (item.Localisation && item.Localisation.toLowerCase().includes(term)) ||
          (item["Référence fournisseur"] && item["Référence fournisseur"].toLowerCase().includes(term))
        );
      });
    }
    
    // Calculer le nombre total de pages
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1; // Au moins 1 page même si vide
    
    // S'assurer que la page demandée est valide
    const validPage = Math.max(1, Math.min(page, totalPages));
    
    // Extraire les éléments pour la page demandée
    const startIndex = (validPage - 1) * pageSize;
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
    console.error("Erreur dans getStockPaginated:", error);
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

// Créer un nouvel article
function createStockItem(itemData) {
  try {
    // Ajouter un ID unique
    itemData.ID = Utilities.getUuid();
    
    // Convertir les champs numériques
    if (itemData.Quantité) itemData.Quantité = Number(itemData.Quantité);
    if (itemData["Seuil alerte"]) itemData["Seuil alerte"] = Number(itemData["Seuil alerte"]);
    
    // Ajouter l'article à la feuille
    return addRow(CONFIG.SHEETS.STOCK, itemData);
  } catch (error) {
    console.error("Erreur dans createStockItem:", error);
    return null;
  }
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
  try {
    // Convertir les champs numériques
    if (itemData.Quantité) itemData.Quantité = Number(itemData.Quantité);
    if (itemData["Seuil alerte"]) itemData["Seuil alerte"] = Number(itemData["Seuil alerte"]);
    
    return updateRow(CONFIG.SHEETS.STOCK, "ID", id, itemData);
  } catch (error) {
    console.error("Erreur dans updateStockItem:", error);
    return false;
  }
}

// Supprimer un article
function deleteStockItem(id) {
  try {
    return deleteRow(CONFIG.SHEETS.STOCK, "ID", id);
  } catch (error) {
    console.error("Erreur dans deleteStockItem:", error);
    return false;
  }
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
