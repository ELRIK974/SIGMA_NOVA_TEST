/**
 * SIGMA - Gestion des emprunts
 * Ce fichier contient toutes les fonctions relatives à la gestion des emprunts
 */

// Obtenir tous les emprunts
function getAllEmprunts() {
  try {
    return getAllData("Emprunts");
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

// Mettre à jour un emprunt
function updateEmprunt(id, empruntData) {
  try {
    return updateRow("Emprunts", "ID", id, empruntData);
  } catch (error) {
    console.error("Erreur dans updateEmprunt:", error);
    return false;
  }
}
// Supprimer un emprunt
function deleteEmprunt(id) {
  try {
    return deleteRow("Emprunts", "ID", id);
  } catch (error) {
    console.error("Erreur dans deleteEmprunt:", error);
    return false;
  }
}
