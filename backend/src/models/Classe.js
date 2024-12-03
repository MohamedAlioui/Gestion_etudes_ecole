const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
  niveau_classe: String,
  nom_classe: String
});

module.exports = mongoose.model('Classe', classeSchema);