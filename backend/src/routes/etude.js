  const express = require('express');
  const router = express.Router();
  const Etude = require('../models/Etude');

  // Move this route to be BEFORE any routes with :id parameters
  router.delete('/all', async (req, res) => {
    try {
      // Delete all etudes
      const result = await Etude.deleteMany({});
      console.log('Deleted etudes count:', result.deletedCount);
      res.json({ 
        message: 'All studies deleted successfully',
        deletedCount: result.deletedCount 
      });
    } catch (error) {
      console.error('Error deleting all studies:', error);
      res.status(500).json({ 
        message: 'Error deleting all studies', 
        error: error.message 
      });
    }
  });

  // Get all studies
  router.get('/', async (req, res) => {
    try {
      const etudes = await Etude.find()
        .populate('enseignant')
        .populate('eleves');
      res.json(etudes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all students from a specific study
  router.get('/:id/students', async (req, res) => {
    try {
      const etude = await Etude.findById(req.params.id)
        .populate({
          path: 'eleves',
          select: 'prenom_eleve nom_eleve date_naissance'
        });

      if (!etude) {
        return res.status(404).json({ message: 'Study not found' });
      }

      res.json(etude.eleves || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      res.status(500).json({ message: err.message });
    }
  });

  // Get one study by ID
  router.get('/:id', async (req, res) => {
    try {
      const etude = await Etude.findById(req.params.id)
        .populate('enseignant')
        .populate('eleves');
      
      if (!etude) {
        return res.status(404).json({ message: 'Study not found' });
      }
      
      res.json(etude);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create new study
  router.post('/', async (req, res) => {
    const etude = new Etude(req.body);
    try {
      const newEtude = await etude.save();
      res.status(201).json(newEtude);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Update study
  router.put('/:id', async (req, res) => {
    try {
      console.log('Update request body:', req.body);
      const etude = await Etude.findById(req.params.id);
      if (!etude) {
        return res.status(404).json({ message: 'Study not found' });
      }

      // If eleves array is provided, ensure it's properly handled
      if (req.body.eleves) {
        // Convert any string IDs to ObjectIds if needed
        etude.eleves = req.body.eleves;
      }

      // Update other fields
      etude.niveau = req.body.niveau || etude.niveau;
      etude.matiere = req.body.matiere || etude.matiere;
      etude.className = req.body.className || etude.className;
      if (req.body.enseignant) {
        etude.enseignant = req.body.enseignant._id || req.body.enseignant;
      }

      // Save and populate
      const updatedEtude = await etude.save();
      const populatedEtude = await Etude.findById(updatedEtude._id)
        .populate('enseignant')
        .populate('eleves');

      res.json(populatedEtude);
    } catch (err) {
      console.error('Error updating etude:', err);
      res.status(400).json({ message: err.message });
    }
  });

  // Delete study
  router.delete('/:id', async (req, res) => {
    try {
      const etude = await Etude.findById(req.params.id);
      if (!etude) return res.status(404).json({ message: 'Study not found' });

      await etude.deleteOne();
      res.json({ message: 'Study deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update the student removal route
  router.delete('/:etudeId/students/:studentId', async (req, res) => {
    try {
      const { etudeId, studentId } = req.params;
      
      const etude = await Etude.findById(etudeId);
      if (!etude) {
        return res.status(404).json({ message: 'Study not found' });
      }

      // Convert ObjectIds to strings for comparison
      etude.eleves = etude.eleves.filter(id => id.toString() !== studentId);
      
      // Save the updated etude
      await etude.save();

      // Return the updated etude with populated fields
      const updatedEtude = await Etude.findById(etudeId)
        .populate('enseignant')
        .populate('eleves');

      res.json(updatedEtude);
    } catch (error) {
      console.error('Error removing student:', error);
      res.status(500).json({ 
        message: 'Error removing student', 
        error: error.message 
      });
    }
  });

  // Add this new route for removing all students
  router.delete('/:etudeId/students', async (req, res) => {
    try {
      const { etudeId } = req.params;
      
      const etude = await Etude.findById(etudeId);
      if (!etude) {
        return res.status(404).json({ message: 'Study not found' });
      }

      // Clear the eleves array
      etude.eleves = [];
      
      // Save the updated etude
      await etude.save();

      // Return the updated etude with populated fields
      const updatedEtude = await Etude.findById(etudeId)
        .populate('enseignant')
        .populate('eleves');

      res.json(updatedEtude);
    } catch (error) {
      console.error('Error removing all students:', error);
      res.status(500).json({ 
        message: 'Error removing all students', 
        error: error.message 
      });
    }
  });

  module.exports = router;