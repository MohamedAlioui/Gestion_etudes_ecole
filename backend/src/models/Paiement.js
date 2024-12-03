const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  etude: { type: mongoose.Schema.Types.ObjectId, ref: 'Etude' },
  total_administration: Number,
  total_enseignant: Number,
  total_seances: Number
});

module.exports = mongoose.model('Paiement', paiementSchema);