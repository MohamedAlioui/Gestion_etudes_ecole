require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable debugging for Mongoose
mongoose.set('debug', true);

// Routes
const indexRoutes = require('./routes/index');
const classeRoutes = require('./routes/classe');
const eleveRoutes = require('./routes/eleve');
const enseignantRoutes = require('./routes/enseignant');
const etudeRoutes = require('./routes/etude');
const seanceRoutes = require('./routes/seance');
const paiementRoutes = require('./routes/paiement');
const searchRoutes = require('./routes/search');
const statsRoutes = require('./routes/stats');
// Routes
app.use('/api/finances', require('./routes/financeRoutes'));
// API Routes
app.use('/api', indexRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/etudes', etudeRoutes);
app.use('/api/seances', seanceRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/search', searchRoutes); 
app.use('/api/stats', statsRoutes);

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 