function testGetAllStock() {
  try {
    const result = getAllStock();
    Logger.log("Résultat getAllStock(): " + JSON.stringify(result));
    return "OK - Nombre d'articles: " + result.length;
  } catch (error) {
    Logger.log("ERREUR: " + error);
    return "ERREUR: " + error;
  }
}
