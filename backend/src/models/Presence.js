const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['Present', 'Absent','Excused'],
  },
  eleve: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve',
    required: true,
  },
  seance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seance',
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Presence', presenceSchema);
