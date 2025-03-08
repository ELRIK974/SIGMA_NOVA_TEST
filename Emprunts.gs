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
    
    let sheet;
    try {
      sheet = getSheetByName("Emprunts");
      if (!sheet) {
        // Créer la feuille si elle n'existe pas
        const spreadsheet = getSpreadsheet();
        sheet = spreadsheet.insertSheet("Emprunts");
        sheet.appendRow(headers);
      }
    } catch (e) {
      console.error("Erreur lors de l'accès/création de la feuille Emprunts:", e);
      return []; // Retourner un tableau vide plutôt que null
    }
    
    // Récupérer les données de manière sécurisée
    try {
      return getAllData("Emprunts") || [];
    } catch (dataError) {
      console.error("Erreur lors de la récupération des données:", dataError);
      return []; // Toujours retourner un tableau vide en cas d'erreur
    }
  } catch (error) {
    console.error("Erreur générale dans getAllEmprunts:", error);
    return []; // Garantir qu'on retourne toujours un tableau
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
