const express = require('express');
const router = express.Router();
const Enseignant = require('../models/Enseignant');

// Get all teachers or filter by subject (matiere)
router.get('/', async (req, res) => {
  try {
    const { matiere } = req.query; // Récupérer le paramètre "matiere" depuis la requête
    const query = matiere ? { matiere } : {}; // Construire le filtre si "matiere" est spécifié
    const enseignants = await Enseignant.find(query);
    res.json(enseignants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one teacher
router.get('/:id', async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) return res.status(404).json({ message: 'Teacher not found' });
    res.json(enseignant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create teacher
router.post('/', async (req, res) => {
  const enseignant = new Enseignant({
    nom_enseignant: req.body.nom_enseignant,
    prenom_enseignant: req.body.prenom_enseignant,
    matiere: req.body.matiere,
    emploi_file: req.body.emploi_file,
    numero_telephone: req.body.numero_telephone // Added numero_telephone field
  });

  try {
    const newEnseignant = await enseignant.save();
    res.status(201).json(newEnseignant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update teacher
router.put('/:id', async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) return res.status(404).json({ message: 'Teacher not found' });

    // Update the teacher's details, including numero_telephone
    enseignant.nom_enseignant = req.body.nom_enseignant || enseignant.nom_enseignant;
    enseignant.prenom_enseignant = req.body.prenom_enseignant || enseignant.prenom_enseignant;
    enseignant.matiere = req.body.matiere || enseignant.matiere;
    enseignant.emploi_file = req.body.emploi_file || enseignant.emploi_file;
    enseignant.numero_telephone = req.body.numero_telephone || enseignant.numero_telephone;

    const updatedEnseignant = await enseignant.save();
    res.json(updatedEnseignant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) return res.status(404).json({ message: 'Teacher not found' });

    await enseignant.deleteOne();
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
