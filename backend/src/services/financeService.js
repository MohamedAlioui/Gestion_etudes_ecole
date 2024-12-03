const mongoose = require('mongoose');
const Seance = require('../models/Seance'); // Adjust the path based on your structure

const calculateTeacherFinance = async (teacherId, etudeId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(etudeId)) {
      throw new Error('Invalid etude ID');
    }

    const seances = await Seance.find({ etude: etudeId })
      .populate({
        path: 'etude',
        populate: {
          path: 'enseignant',
          model: 'Enseignant',
          match: { _id: teacherId }
        }
      })
      .populate('presences.eleve')
      .exec();

    if (!seances || seances.length === 0) {
      return { message: 'No sessions found for this teacher in the given etude', totalPayment: 0 };
    }

    let totalPayment = 0;

    seances.forEach((seance) => {
      if (seance.etude && seance.etude.enseignant) {
        seance.presences.forEach((presence) => {
          if (presence.status === 'present') {
            totalPayment += 8.75;
          } else if (presence.status === 'absent_verified') {
            totalPayment += 8.75 * 0.65;
          }
        });
      }
    });

    return { totalPayment };
  } catch (error) {
    console.error('Error calculating finance:', error);
    throw new Error('Error calculating finance');
  }
};

module.exports = calculateTeacherFinance;
