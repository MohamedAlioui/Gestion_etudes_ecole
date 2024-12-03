const express = require('express');
const router = express.Router();
const Seance = require('../models/Seance');
const mongoose = require('mongoose');

// Delete all sessions
router.delete('/', async (req, res) => {
  try {
    await Seance.deleteMany({});
    res.json({ message: 'All sessions deleted successfully' });
  } catch (err) {
    console.error('Error deleting all sessions:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all sessions with populated fields
router.get('/', async (req, res) => {
  try {
    const seances = await Seance.find()
      .populate({
        path: 'etude',
        populate: {
          path: 'eleves',
          model: 'Eleve'
        }
      })
      .populate('presences.eleve')
      .exec(); // Add exec() to properly execute the query
    
    if (!seances) {
      return res.status(404).json({ message: 'No sessions found' });
    }
    
    res.json(seances);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/seances', async (req, res) => {
  const { etude, start_date, end_date } = req.query;

  if (!etude || !start_date || !end_date) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  try {
    const seances = await Etude.findById(etude)
      .populate({
        path: 'seances',
        match: {
          date: {
            $gte: new Date(start_date),
            $lte: new Date(end_date)
          }
        }
      });

    if (!seances) {
      return res.status(404).json({ message: 'Study not found' });
    }

    res.json(seances.seances);
  } catch (err) {
    console.error('Error fetching seances:', err);
    res.status(500).json({ message: err.message });
  }
});
// Get one session
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const seance = await Seance.findById(req.params.id)
      .populate({
        path: 'etude',
        populate: {
          path: 'eleves',
          model: 'Eleve'
        }
      })
      .populate('presences.eleve')
      .exec();

    if (!seance) return res.status(404).json({ message: 'Session not found' });
    res.json(seance);
  } catch (err) {
    console.error('Error fetching session:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create session
router.post('/', async (req, res) => {
  try {
    const { date_seance, etude_id, presences } = req.body;

    // Validate required fields
    if (!date_seance || !etude_id) {
      return res.status(400).json({ message: 'Date and etude_id are required' });
    }

    // Validate etude_id is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(etude_id)) {
      return res.status(400).json({ message: 'Invalid etude ID' });
    }
    
    const seance = new Seance({
      date_seance: new Date(date_seance), // Ensure proper date format
      etude: etude_id,
      presences: presences || []
    });

    const newSeance = await seance.save();
    
    // Populate the response
    const populatedSeance = await Seance.findById(newSeance._id)
      .populate({
        path: 'etude',
        populate: {
          path: 'eleves',
          model: 'Eleve'
        }
      })
      .populate('presences.eleve')
      .exec();
    
    if (!populatedSeance) {
      return res.status(404).json({ message: 'Error retrieving created session' });
    }
    
    res.status(201).json(populatedSeance);
  } catch (err) {
    console.error('Error creating seance:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const seance = await Seance.findById(req.params.id);
    if (!seance) return res.status(404).json({ message: 'Session not found' });

    // Validate date_seance if provided
    if (req.body.date_seance) {
      req.body.date_seance = new Date(req.body.date_seance);
    }

    // Validate etude if provided
    if (req.body.etude && !mongoose.Types.ObjectId.isValid(req.body.etude)) {
      return res.status(400).json({ message: 'Invalid etude ID' });
    }

    Object.assign(seance, req.body);
    const updatedSeance = await seance.save();
    
    // Populate the response
    const populatedSeance = await Seance.findById(updatedSeance._id)
      .populate({
        path: 'etude',
        populate: {
          path: 'eleves',
          model: 'Eleve'
        }
      })
      .populate('presences.eleve')
      .exec();
    
    if (!populatedSeance) {
      return res.status(404).json({ message: 'Error retrieving updated session' });
    }
    
    res.json(populatedSeance);
  } catch (err) {
    console.error('Error updating session:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const seance = await Seance.findById(req.params.id);
    if (!seance) return res.status(404).json({ message: 'Session not found' });

    await seance.deleteOne();
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get seances for an etude
router.get('/etude/:etudeId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.etudeId)) {
      return res.status(400).json({ message: 'Invalid etude ID' });
    }

    const seances = await Seance.find({ etude: req.params.etudeId })
      .populate({
        path: 'etude',
        populate: {
          path: 'eleves',
          model: 'Eleve'
        }
      })
      .populate('presences.eleve')
      .exec();

    if (!seances || seances.length === 0) {
      return res.status(404).json({ message: 'No sessions found for this etude' });
    }

    res.json(seances);
  } catch (err) {
    console.error('Error fetching seances for etude:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get attendance for a specific session
router.get('/:sessionId/attendance', async (req, res) => {
  try {
    const seance = await Seance.findById(req.params.sessionId).populate('presences.eleve');
    if (!seance) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(seance.presences);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

// Update attendance for a specific session
router.put('/:sessionId/attendance', async (req, res) => {
  try {
    const { presences } = req.body;
    const seance = await Seance.findById(req.params.sessionId);
    if (!seance) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update the presences
    seance.presences = presences;
    await seance.save();

    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance' });
  }
});

// Get all sessions for Kanban
router.get('/kanban', async (req, res) => {
  try {
    const sessions = await Seance.find()
      .populate({
        path: 'etude',
        populate: {
          path: 'enseignant',
          select: 'nom_enseignant prenom_enseignant'
        }
      })
      .sort({ date_seance: 1 });

    if (!sessions) {
      return res.status(404).json({ message: 'No sessions found' });
    }

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error while fetching sessions' });
  }
});

// Update session status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const session = await Seance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate({
      path: 'etude',
      populate: {
        path: 'enseignant',
        select: 'nom_enseignant prenom_enseignant'
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ message: 'Server error while updating session status' });
  }
});

module.exports = router;