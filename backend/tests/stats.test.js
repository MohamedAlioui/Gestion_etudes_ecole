const { describe, it, expect, beforeEach, afterEach } = require('vitest');
const request = require('supertest');
const app = require('../src/server');
const Etude = require('../src/models/Etude');
const Seance = require('../src/models/Seance');
const Paiement = require('../src/models/Paiement');

describe('Stats API', () => {
  let etudeId;

  beforeEach(async () => {
    const etude = await Etude.create({
      matiere: 'Math',
      niveau: '7éme année'
    });
    etudeId = etude._id;

    await Seance.create([
      {
        date_seance: new Date(),
        etude: etudeId,
        presences: [
          { eleve: '507f1f77bcf86cd799439011', status: 'present' }
        ]
      }
    ]);

    await Paiement.create({
      etude: etudeId,
      total_administration: 100,
      total_enseignant: 200,
      total_seances: 10
    });
  });

  afterEach(async () => {
    await Etude.deleteMany({});
    await Seance.deleteMany({});
    await Paiement.deleteMany({});
  });

  describe('GET /api/stats/attendance/:etudeId', () => {
    it('should get attendance stats', async () => {
      const res = await request(app)
        .get(`/api/stats/attendance/${etudeId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalSessions');
      expect(res.body).toHaveProperty('attendanceByStudent');
      expect(res.body).toHaveProperty('averageAttendance');
    });
  });

  describe('GET /api/stats/payments/:etudeId', () => {
    it('should get payment stats', async () => {
      const res = await request(app)
        .get(`/api/stats/payments/${etudeId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalPayments');
      expect(res.body).toHaveProperty('totalAdministration');
      expect(res.body).toHaveProperty('totalEnseignant');
      expect(res.body).toHaveProperty('totalSeances');
    });
  });
});