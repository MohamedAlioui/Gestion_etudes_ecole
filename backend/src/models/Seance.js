const mongoose = require('mongoose');

const seanceSchema = new mongoose.Schema({
  date_seance: {
    type: Date,
    required: true
  },
  etude: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etude',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  presences: [{
    eleve: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Eleve',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'absent_verified'],
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Seance', seanceSchema);