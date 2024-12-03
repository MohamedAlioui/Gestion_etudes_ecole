const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');

// Search students
router.get('/eleves', async (req, res) => {
  try {
    const results = await searchService.searchEleves(req.query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search teachers
router.get('/enseignants', async (req, res) => {
  try {
    const results = await searchService.searchEnseignants(req.query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search studies
router.get('/etudes', async (req, res) => {
  try {
    const results = await searchService.searchEtudes(req.query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;