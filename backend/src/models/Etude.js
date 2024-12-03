const mongoose = require('mongoose');

const etudeSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true
  },
  matiere: {
    type: String,
    required: true,
    enum: ['Francais', 'Arabic', 'Mathematique','Anglais','ScienceVieTerre']
  },
  niveau: {
    type: String,
    required: true
  },
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enseignant',
    required: true
  },
  eleves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Etude', etudeSchema);