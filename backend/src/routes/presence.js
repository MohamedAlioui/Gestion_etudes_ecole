const express = require('express');
const connectDB = require('./config/database');

const Eleve = require('./models/Eleve');
const Seance = require('./models/Seance');
const Presence = require('./models/Presence');

const app = express();

app.use(express.json());

// Connect to the database
connectDB();

// CRUD Operations

// Create a new Presence
app.post('/presences', async (req, res) => {
  const { eleveId, seanceId, status } = req.body;

  try {
    const presence = new Presence({
      eleve: eleveId,
      seance: seanceId,
      status,
    });
    await presence.save();
    res.status(201).json(presence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Presences for a specific Seance
app.get('/presences/seance/:seanceId', async (req, res) => {
  const { seanceId } = req.params;

  try {
    const presences = await Presence.find({ seance: seanceId })
      .populate('eleve', 'nom_eleve prenom_eleve')
      .populate('seance', 'date_seance');
    res.json(presences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Presence Status
app.patch('/presences/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const presence = await Presence.findById(id);

    if (!presence) {
      return res.status(404).json({ message: 'Presence not found' });
    }

    presence.status = status;
    await presence.save();

    res.json(presence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Presence
app.delete('/presences/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const presence = await Presence.findByIdAndDelete(id);

    if (!presence) {
      return res.status(404).json({ message: 'Presence not found' });
    }

    res.json({ message: 'Presence deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
