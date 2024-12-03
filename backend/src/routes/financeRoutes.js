const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');
const Seance = require('../models/Seance');
const Enseignant = require('../models/Enseignant');

const TAUX_BASE = 8.75;
const TAUX_PRESENCE = 0.65; // 65%

// Helper functions
const getMonthDates = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

const calculateSessionFinance = (presences) => {
  let totalAmount = 0;
  presences.forEach(presence => {
    if (presence.status === 'present' || presence.status === 'absent') {
      totalAmount += TAUX_BASE * TAUX_PRESENCE;
    }
  });
  return totalAmount;
};

const getPresenceStats = (presences) => ({
  total: presences.length,
  present: presences.filter(p => p.status === 'present').length,
  absent_verified: presences.filter(p => p.status === 'absent_verified').length,
  absent: presences.filter(p => p.status === 'absent').length
});

// Get finance for a specific teacher and etude with filters
router.get('/enseignant/:enseignantId/etude/:etudeId', async (req, res) => {
  try {
    const { month, year, start_date, end_date } = req.query;
    let query = { etude: req.params.etudeId };

    if (month && year) {
      const { startDate, endDate } = getMonthDates(parseInt(year), parseInt(month));
      query.date_seance = { $gte: startDate, $lte: endDate };
    } else if (start_date && end_date) {
      query.date_seance = { $gte: new Date(start_date), $lte: new Date(end_date) };
    }

    const seances = await Seance.find(query)
      .populate('presences.eleve')
      .sort({ date_seance: 1 });

    let totalFinance = 0;
    const financeDetails = [];
    const monthlyBreakdown = {};

    for (const seance of seances) {
      const montant = calculateSessionFinance(seance.presences);
      totalFinance += montant;

      // Monthly breakdown
      const monthKey = seance.date_seance.toISOString().slice(0, 7);
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = {
          month: seance.date_seance.getMonth() + 1,
          year: seance.date_seance.getFullYear(),
          totalMontant: 0,
          sessionCount: 0,
          presenceStats: { total: 0, present: 0, absent_verified: 0, absent: 0 }
        };
      }

      const stats = getPresenceStats(seance.presences);
      monthlyBreakdown[monthKey].totalMontant += montant;
      monthlyBreakdown[monthKey].sessionCount++;
      Object.keys(stats).forEach(key => {
        monthlyBreakdown[monthKey].presenceStats[key] += stats[key];
      });

      financeDetails.push({
        seance: seance._id,
        date: seance.date_seance,
        presences: seance.presences.map(p => ({
          eleve: p.eleve,
          status: p.status,
          montant: (p.status === 'present' || p.status === 'absent_verified') ? 
            TAUX_BASE * TAUX_PRESENCE : 0
        })),
        presenceStats: stats,
        totalSeance: montant
      });
    }

    res.json({
      enseignant: req.params.enseignantId,
      etude: req.params.etudeId,
      period: {
        start: query.date_seance?.$gte || seances[0]?.date_seance,
        end: query.date_seance?.$lte || seances[seances.length - 1]?.date_seance
      },
      details: financeDetails,
      monthlyBreakdown: Object.values(monthlyBreakdown),
      totalFinance,
      summary: {
        totalSessions: seances.length,
        averagePerSession: seances.length ? (totalFinance / seances.length).toFixed(2) : 0,
        baseRate: TAUX_BASE,
        presenceRate: TAUX_PRESENCE,
        presenceStats: seances.reduce((acc, seance) => {
          const stats = getPresenceStats(seance.presences);
          Object.keys(stats).forEach(key => acc[key] += stats[key]);
          return acc;
        }, { total: 0, present: 0, absent_verified: 0, absent: 0 })
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get monthly finance summary with detailed stats
router.get('/monthly-summary', async (req, res) => {
  try {
    const { month, year, include_details } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const { startDate, endDate } = getMonthDates(parseInt(year), parseInt(month));

    const seances = await Seance.find({
      date_seance: { $gte: startDate, $lte: endDate }
    })
    .populate('presences.eleve')
    .populate({
      path: 'etude',
      populate: { path: 'enseignant' }
    })
    .sort({ date_seance: 1 });

    const summary = {
      period: {
        month: parseInt(month),
        year: parseInt(year),
        startDate,
        endDate
      },
      teachers: {},
      totalMontant: 0,
      totalSessions: seances.length,
      globalStats: {
        totalStudents: 0,
        presenceStats: { total: 0, present: 0, absent_verified: 0, absent: 0 }
      }
    };

    for (const seance of seances) {
      const montant = calculateSessionFinance(seance.presences);
      const teacherId = seance.etude.enseignant._id.toString();
      const stats = getPresenceStats(seance.presences);

      // Update global stats
      Object.keys(stats).forEach(key => {
        summary.globalStats.presenceStats[key] += stats[key];
      });

      if (!summary.teachers[teacherId]) {
        summary.teachers[teacherId] = {
          enseignant: seance.etude.enseignant,
          totalMontant: 0,
          sessionCount: 0,
          presenceStats: { total: 0, present: 0, absent_verified: 0, absent: 0 },
          etudes: {},
          details: include_details ? [] : undefined
        };
      }

      const teacher = summary.teachers[teacherId];
      const etudeId = seance.etude._id.toString();

      if (!teacher.etudes[etudeId]) {
        teacher.etudes[etudeId] = {
          etude: seance.etude,
          totalMontant: 0,
          sessionCount: 0,
          presenceStats: { total: 0, present: 0, absent_verified: 0, absent: 0 }
        };
      }

      // Update teacher stats
      teacher.totalMontant += montant;
      teacher.sessionCount++;
      Object.keys(stats).forEach(key => {
        teacher.presenceStats[key] += stats[key];
      });

      // Update etude stats
      const etude = teacher.etudes[etudeId];
      etude.totalMontant += montant;
      etude.sessionCount++;
      Object.keys(stats).forEach(key => {
        etude.presenceStats[key] += stats[key];
      });

      if (include_details) {
        teacher.details.push({
          seance: seance._id,
          date: seance.date_seance,
          etude: seance.etude,
          montant,
          presenceStats: stats
        });
      }

      summary.totalMontant += montant;
    }

    // Convert objects to arrays and calculate averages
    summary.teachers = Object.values(summary.teachers).map(teacher => ({
      ...teacher,
      averagePerSession: teacher.sessionCount ? (teacher.totalMontant / teacher.sessionCount).toFixed(2) : 0,
      etudes: Object.values(teacher.etudes).map(etude => ({
        ...etude,
        averagePerSession: etude.sessionCount ? (etude.totalMontant / etude.sessionCount).toFixed(2) : 0
      }))
    }));

    summary.averagePerSession = summary.totalSessions ? 
      (summary.totalMontant / summary.totalSessions).toFixed(2) : 0;

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Calculate and store finance for a specific session with detailed breakdown
router.post('/calculate/:seanceId', async (req, res) => {
  try {
    const seance = await Seance.findById(req.params.seanceId)
      .populate('presences.eleve')
      .populate({
        path: 'etude',
        populate: { path: 'enseignant' }
      });

    if (!seance) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const montant = calculateSessionFinance(seance.presences);
    const stats = getPresenceStats(seance.presences);

    const finance = await Finance.findOneAndUpdate(
      { 
        seance: seance._id, 
        enseignant: seance.etude.enseignant._id,
        etude: seance.etude._id 
      },
      {
        montant,
        date_calcul: new Date()
      },
      { upsert: true, new: true }
    );

    const presenceDetails = seance.presences.map(p => ({
      eleve: p.eleve,
      status: p.status,
      montant: (p.status === 'present' || p.status === 'absent_verified') ? 
        TAUX_BASE * TAUX_PRESENCE : 0
    }));

    res.json({
      finance,
      details: {
        date: seance.date_seance,
        presenceStats: stats,
        base_rate: TAUX_BASE,
        presence_rate: TAUX_PRESENCE,
        total: montant,
        averagePerStudent: stats.total ? (montant / stats.total).toFixed(2) : 0,
        breakdown: presenceDetails
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;