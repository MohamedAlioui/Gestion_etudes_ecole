const mongoose = require('mongoose');

// Define the Teacher schema
const enseignantSchema = new mongoose.Schema({
  nom_enseignant: String,
  prenom_enseignant: String,
  matiere: String,
  emploi_file: Buffer,
  numero_telephone: String // Updated field to store phone number
});

// Create and export the Teacher model
module.exports = mongoose.model('Enseignant', enseignantSchema);
