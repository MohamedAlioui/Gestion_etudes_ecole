const express = require('express');
const router = express.Router();
const Eleve = require('../models/Eleve');
const Classe = require('../models/Classe');
const mongoose = require('mongoose');

// Get all students
router.get('/', async (req, res) => {
  try {
    const { classId } = req.query;
    const filter = classId ? { classe: classId } : {};
    const eleves = await Eleve.find(filter)
      .populate('classe')
      .populate('etudes');
    res.json(eleves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get one student
router.get('/:id', async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
      .populate('classe')
      .populate('etudes');
    if (!eleve) return res.status(404).json({ message: 'Student not found' });
    res.json(eleve);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new student
router.post('/', async (req, res) => {
  try {
    const { nom_eleve, prenom_eleve, date_naissance, nom_parent, num_parent, classe, etudes } = req.body;

    if (classe && !mongoose.Types.ObjectId.isValid(classe)) {
      return res.status(400).send({ error: 'Invalid class ID' });
    }

    if (classe) {
      const classFound = await Classe.findById(classe);
      if (!classFound) {
        return res.status(400).send({ error: 'Classe not found' });
      }
    }

    if (etudes) {
      for (const etudeId of etudes) {
        if (!mongoose.Types.ObjectId.isValid(etudeId)) {
          return res.status(400).send({ error: `Invalid Etude ID: ${etudeId}` });
        }
      }
    }

    const newStudent = new Eleve({
      nom_eleve,
      prenom_eleve,
      date_naissance,
      nom_parent,
      num_parent,
      classe,
      etudes
    });

    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id);
    if (!eleve) return res.status(404).json({ message: 'Student not found' });

    Object.assign(eleve, req.body);
    const updatedEleve = await eleve.save();
    res.json(updatedEleve);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id);
    if (!eleve) return res.status(404).json({ message: 'Student not found' });

    await eleve.deleteOne();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.get('/classe/:classeId', async (req, res) => {
  try {
    const { classeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(classeId)) {
      return res.status(400).json({ message: 'Invalid class ID format' });
    }

    const eleves = await Eleve.find({ classe: classeId })
      .populate('classe')
      .populate('etudes');
    
    res.json(eleves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:etudeId/students/:studentId', async (req, res) => {
  try {
    const { etudeId, studentId } = req.params;
    
    // Find and update the etude document
    const updatedEtude = await Etude.findByIdAndUpdate(
      etudeId,
      { $pull: { eleves: studentId } },  // $pull removes the studentId from eleves array
      { new: true }  // returns the updated document
    );

    if (!updatedEtude) {
      return res.status(404).json({ message: 'Etude not found' });
    }

    res.json(updatedEtude);
  } catch (error) {
    console.error('Error removing student from etude:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 
// Bulk import students
router.post('/import', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { students, classId } = req.body;

    if (classId) {
      const classExists = await Classe.findById(classId);
      if (!classExists) {
        throw new Error('Invalid class ID');
      }
    }

    const preparedStudents = students.map(student => ({
      ...student,
      classe: classId,
      date_naissance: student.date_naissance ? new Date(student.date_naissance) : null
    }));

    const result = await Eleve.insertMany(preparedStudents, { session });
    
    await session.commitTransaction();
    res.status(201).json(result);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error importing students:', error);
    res.status(400).json({ 
      message: 'Failed to import students', 
      error: error.message 
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;