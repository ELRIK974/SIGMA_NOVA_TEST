/**
 * SIGMA - Données de test
 * Ce fichier contient des fonctions pour générer des données de test
 */

// Fonction pour ajouter des emprunts de test
function addTestEmprunts() {
  try {
    // Assurer l'existence de la feuille avec les en-têtes requis
    const headers = ["ID", "Nom Manipulation", "Lieu", "Date départ", "Date retour", 
                     "Secteur", "Référent", "Emprunteur", "Statut", "Date création", "Notes"];
    
    const sheet = ensureSheetExists("Emprunts", headers);
    
    // Préparer des données de test avec des dates valides
    const today = new Date();
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    // Date de départ (aujourd'hui)
    const departDate = formatDate(today);
    
    // Date de retour (aujourd'hui + 15 jours)
    const retourDate = new Date(today);
    retourDate.setDate(today.getDate() + 15);
    const formattedRetour = formatDate(retourDate);
    
    // Création date
    const creationDate = formatDate(today);
    
    // Créer les données de test
    const testEmprunts = [
      {
        ID: generateUniqueId(),
        "Nom Manipulation": "Animation Scientifique",
        "Lieu": "École Jean Moulin",
        "Date départ": departDate,
        "Date retour": formattedRetour,
        "Secteur": "Sciences",
        "Référent": "Thomas Martin",
        "Emprunteur": "Marie Laurent",
        "Statut": "Pas prêt",
        "Date création": creationDate,
        "Notes": "Test généré automatiquement"
      },
      {
        ID: generateUniqueId(),
        "Nom Manipulation": "Atelier Robotique",
        "Lieu": "Collège Victor Hugo",
        "Date départ": departDate,
        "Date retour": formattedRetour,
        "Secteur": "Technologie",
        "Référent": "Sophie Dupont",
        "Emprunteur": "Jean Durand",
        "Statut": "Prêt",
        "Date création": creationDate,
        "Notes": "Test généré automatiquement"
      }
    ];
    
    let addedCount = 0;
    
    // Vérifier si la feuille est vide (sauf en-têtes)
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      console.log("La feuille est vide, ajout direct des données");
      // Ajouter directement les emprunts de test
      testEmprunts.forEach(emprunt => {
        // Créer un tableau dans le même ordre que les en-têtes
        const rowArray = headers.map(header => emprunt[header] || '');
        sheet.appendRow(rowArray);
        addedCount++;
      });
    } else {
      console.log("La feuille contient déjà des données, vérification des doublons");
      // Vérification de doublons si des données existent déjà
      const allEmprunts = getAllData("Emprunts") || [];
      
      testEmprunts.forEach(emprunt => {
        // Vérifier que l'emprunt n'existe pas déjà
        const exists = allEmprunts.some(e => 
          e["Nom Manipulation"] === emprunt["Nom Manipulation"] && 
          e["Lieu"] === emprunt["Lieu"]
        );
        
        if (!exists) {
          // Ajouter si n'existe pas
          const rowArray = headers.map(header => emprunt[header] || '');
          sheet.appendRow(rowArray);
          addedCount++;
        }
      });
    }
    
    // Forcer l'invalidation du cache
    invalidateDataCache("Emprunts");
    
    return `${addedCount} emprunts de test ajoutés avec succès`;
  } catch (error) {
    console.error("Erreur lors de l'ajout des emprunts de test:", error);
    return "Erreur: " + error.toString();
  }
}
