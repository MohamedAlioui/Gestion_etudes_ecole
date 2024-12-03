const express = require('express');
const router = express.Router();
const statsService = require('../services/statsService');

// Get attendance statistics
router.get('/attendance/:etudeId', async (req, res) => {
  try {
    const stats = await statsService.getAttendanceStats(req.params.etudeId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get payment statistics
router.get('/payments/:etudeId', async (req, res) => {
  try {
    const stats = await statsService.getPaymentStats(req.params.etudeId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;