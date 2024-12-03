const express = require('express');
const router = express.Router();
const Paiement = require('../models/Paiement');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const paiements = await Paiement.find().populate('etude');
    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one payment
router.get('/:id', async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id).populate('etude');
    if (!paiement) return res.status(404).json({ message: 'Payment not found' });
    res.json(paiement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create payment
router.post('/', async (req, res) => {
  const paiement = new Paiement({
    etude: req.body.etude_id,
    total_administration: req.body.total_administration,
    total_enseignant: req.body.total_enseignant,
    total_seances: req.body.total_seances
  });

  try {
    const newPaiement = await paiement.save();
    res.status(201).json(newPaiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id);
    if (!paiement) return res.status(404).json({ message: 'Payment not found' });

    Object.assign(paiement, req.body);
    const updatedPaiement = await paiement.save();
    res.json(updatedPaiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id);
    if (!paiement) return res.status(404).json({ message: 'Payment not found' });

    await paiement.deleteOne();
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;