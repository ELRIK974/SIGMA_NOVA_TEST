/**
 * SIGMA - Gestion des emprunts
 * Ce fichier contient toutes les fonctions relatives à la gestion des emprunts
 */

// Obtenir tous les emprunts
function getAllEmprunts() {
  try {
    // S'assurer que la feuille Emprunts existe avec les bons en-têtes
    const headers = ["ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", 
                    "Secteur", "Référent", "Emprunteur", "Statut", "Date création", "Notes"];
    
    // Force la création de la feuille si elle n'existe pas
    const sheet = ensureSheetExists("Emprunts", headers);
    
    // Vérifier s'il y a des données
    const data = sheet.getDataRange().getValues();
    
    // Si la feuille est vide ou contient uniquement les en-têtes
    if (data.length <= 1) {
      console.log("La feuille Emprunts est vide, ajout de données de test...");
      addTestEmprunts();
      // Recharger les données après avoir ajouté les données de test
      return getAllData("Emprunts") || [];
    }
    
    // Récupération normale des données
    const emprunts = getAllData("Emprunts");
    console.log(`Récupération de ${emprunts.length} emprunts`);
    return emprunts || [];
  } catch (error) {
    console.error("Erreur critique dans getAllEmprunts:", error);
    // Toujours retourner un tableau, même en cas d'erreur
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
