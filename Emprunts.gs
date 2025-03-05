/**
 * SIGMA - Gestion des emprunts
 * Ce fichier contient toutes les fonctions relatives à la gestion des emprunts
 */

// Obtenir tous les emprunts
function getAllEmprunts() {
  try {
    // Vérifier que la feuille existe
    const sheet = getSheetByName("Emprunts");
    if (!sheet) {
      console.error("La feuille 'Emprunts' n'existe pas");
      return [];
    }
    
    // Vérifier qu'il y a des données (au-delà de la ligne d'en-tête)
    if (sheet.getLastRow() <= 1) {
      console.log("La feuille 'Emprunts' ne contient que l'en-tête");
      return [];
    }
    
    // Obtenir toutes les données
    const data = getAllData("Emprunts");
    
    // S'assurer qu'un tableau est retourné même si getAllData échoue
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur dans getAllEmprunts:", error);
    return [];
  }
}

// Créer un nouvel emprunt
function createEmprunt(empruntData) {
  try {
    // Ajouter des champs automatiques
    empruntData.ID = generateUniqueId();
    empruntData.Statut = "Pas prêt";
    empruntData["Date création"] = new Date().toLocaleDateString("fr-FR");
    
    // Ajouter l'emprunt à la feuille
    return addRow("Emprunts", empruntData);
  } catch (error) {
    console.error("Erreur dans createEmprunt:", error);
    return null;
  }
}

// Obtenir un emprunt par son ID
function getEmpruntById(id) {
  try {
    const emprunts = getAllEmprunts();
    return emprunts.find(emp => emp.ID === id);
  } catch (error) {
    console.error("Erreur dans getEmpruntById:", error);
    return null;
  }
}

// Mettre à jour le statut d'un emprunt
function updateEmpruntStatus(id, newStatus) {
  try {
    return updateRow("Emprunts", "ID", id, { Statut: newStatus });
  } catch (error) {
    console.error("Erreur dans updateEmpruntStatus:", error);
    return false;
  }
}

// Supprimer un emprunt (réservé aux administrateurs)
function deleteEmprunt(id) {
  try {
    return deleteRow("Emprunts", "ID", id);
  } catch (error) {
    console.error("Erreur dans deleteEmprunt:", error);
    return false;
  }
}
