const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  nom_eleve: String,
  prenom_eleve: String,
  date_naissance: Date,
  nom_parent: String,
  num_parent: String,
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
  etudes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Etude' }]
});

module.exports = mongoose.model('Eleve', eleveSchema);