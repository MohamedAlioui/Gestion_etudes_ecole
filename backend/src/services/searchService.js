const Classe = require('../models/Classe');
const Eleve = require('../models/Eleve');
const Enseignant = require('../models/Enseignant');
const Etude = require('../models/Etude');

const searchService = {
  // Search students by various criteria
  async searchEleves(query) {
    const {
      nom,
      classe,
      niveau,
      dateNaissanceStart,
      dateNaissanceEnd
    } = query;

    let searchQuery = {};

    if (nom) {
      searchQuery.$or = [
        { nom_eleve: new RegExp(nom, 'i') },
        { prenom_eleve: new RegExp(nom, 'i') }
      ];
    }

    if (classe) {
      searchQuery.classe = classe;
    }

    if (dateNaissanceStart || dateNaissanceEnd) {
      searchQuery.date_naissance = {};
      if (dateNaissanceStart) {
        searchQuery.date_naissance.$gte = new Date(dateNaissanceStart);
      }
      if (dateNaissanceEnd) {
        searchQuery.date_naissance.$lte = new Date(dateNaissanceEnd);
      }
    }

    return Eleve.find(searchQuery)
      .populate('classe')
      .populate('etudes');
  },

  // Search teachers by subject or name
  async searchEnseignants(query) {
    const { nom, matiere } = query;
    let searchQuery = {};

    if (nom) {
      searchQuery.$or = [
        { nom_enseignant: new RegExp(nom, 'i') },
        { prenom_enseignant: new RegExp(nom, 'i') }
      ];
    }

    if (matiere) {
      searchQuery.matiere = new RegExp(matiere, 'i');
    }

    return Enseignant.find(searchQuery);
  },

  // Search studies by subject, level, or teacher
  async searchEtudes(query) {
    const { matiere, niveau, enseignant } = query;
    let searchQuery = {};

    if (matiere) {
      searchQuery.matiere = new RegExp(matiere, 'i');
    }

    if (niveau) {
      searchQuery.niveau = new RegExp(niveau, 'i');
    }

    if (enseignant) {
      searchQuery.enseignant = enseignant;
    }

    return Etude.find(searchQuery)
      .populate('enseignant')
      .populate('eleves');
  }
};

module.exports = searchService;