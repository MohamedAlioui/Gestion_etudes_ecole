const express = require('express');
const router = express.Router();
const Classe = require('../models/Classe');


const Eleve = require('../models/Eleve'); 
// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Classe.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one class
router.get('/:id', async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id);
    if (!classe) return res.status(404).json({ message: 'Class not found' });
    res.json(classe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create class
router.post('/', async (req, res) => {
  const classe = new Classe({
    niveau_classe: req.body.niveau_classe,
    nom_classe: req.body.nom_classe
  });

  try {
    const newClasse = await classe.save();
    res.status(201).json(newClasse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update class
router.put('/:id', async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id);
    if (!classe) return res.status(404).json({ message: 'Class not found' });

    Object.assign(classe, req.body);
    const updatedClasse = await classe.save();
    res.json(updatedClasse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id);
    if (!classe) return res.status(404).json({ message: 'Class not found' });

    await classe.deleteOne();
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all students by class name (nom_classe)
router.get('/', async (req, res) => {
  const { nom_classe } = req.query;
  console.log('Received class name:', nom_classe);

  try {
    const classe = await Classe.findOne({ nom_classe });
    console.log('Found class:', classe);

    if (!classe) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const students = await Eleve.find({ classe_id: classe._id });
    console.log('Found students:', students); 
    res.json(students);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;


module.exports = router;