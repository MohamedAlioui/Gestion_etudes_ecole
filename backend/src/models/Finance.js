const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enseignant',
    required: true
  },
  seance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seance',
    required: true
  },
  etude: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etude',
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  date_calcul: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Finance', financeSchema);