const express = require('express');
const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to School Management API',
    endpoints: {
      classes: '/api/classes',
      students: '/api/eleves',
      teachers: '/api/enseignants',
      studies: '/api/etudes',
      sessions: '/api/seances',
      payments: '/api/paiements'
    }
  });
});

module.exports = router;