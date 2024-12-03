module.exports = {
  mongodb: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
    collections: {
      classe: 'classes',
      eleve: 'eleves',
      enseignant: 'enseignants',
      etude: 'etudes',
      seance: 'seances',
      paiement: 'paiements'
    },
    indexes: {
      eleve: {
        nom_eleve: 1,
        prenom_eleve: 1
      },
      enseignant: {
        matiere: 1
      },
      etude: {
        matiere: 1,
        niveau: 1
      }
    }
  }
};