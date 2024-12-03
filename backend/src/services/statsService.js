const Eleve = require('../models/Eleve');
const Seance = require('../models/Seance');
const Paiement = require('../models/Paiement');

const statsService = {
  // Get attendance statistics for a study
  async getAttendanceStats(etudeId) {
    const seances = await Seance.find({ etude: etudeId });
    let stats = {
      totalSessions: seances.length,
      attendanceByStudent: {},
      averageAttendance: 0
    };

    seances.forEach(seance => {
      seance.presences.forEach(presence => {
        const studentId = presence.eleve.toString();
        if (!stats.attendanceByStudent[studentId]) {
          stats.attendanceByStudent[studentId] = {
            present: 0,
            absent: 0
          };
        }
        stats.attendanceByStudent[studentId][presence.status]++;
      });
    });

    // Calculate average attendance
    const totalStudents = Object.keys(stats.attendanceByStudent).length;
    if (totalStudents > 0) {
      let totalAttendance = 0;
      Object.values(stats.attendanceByStudent).forEach(record => {
        totalAttendance += (record.present / (record.present + record.absent)) * 100;
      });
      stats.averageAttendance = totalAttendance / totalStudents;
    }

    return stats;
  },

  // Get payment statistics
  async getPaymentStats(etudeId) {
    const payments = await Paiement.find({ etude: etudeId });
    return {
      totalPayments: payments.length,
      totalAdministration: payments.reduce((sum, p) => sum + p.total_administration, 0),
      totalEnseignant: payments.reduce((sum, p) => sum + p.total_enseignant, 0),
      totalSeances: payments.reduce((sum, p) => sum + p.total_seances, 0)
    };
  }
};

module.exports = statsService;