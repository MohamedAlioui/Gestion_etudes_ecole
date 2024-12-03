const { describe, it, expect, beforeEach, afterEach } = require('vitest');
const request = require('supertest');
const app = require('../src/server');
const Eleve = require('../src/models/Eleve');
const Classe = require('../src/models/Classe');

describe('Eleve API', () => {
  let classeId;

  beforeEach(async () => {
    await Eleve.deleteMany({});
    const classe = await Classe.create({
      niveau_classe: '7éme année',
      nom_classe: '7b7'
    });
    classeId = classe._id;
  });

  afterEach(async () => {
    await Eleve.deleteMany({});
    await Classe.deleteMany({});
  });

  describe('POST /api/eleves', () => {
    it('should create a new student', async () => {
      const res = await request(app)
        .post('/api/eleves')
        .send({
          nom_eleve: 'Alioui',
          prenom_eleve: 'Mohamed',
          date_naissance: '2010-01-01',
          nom_parent: 'Mohamed Alioui',
          num_parent: '20778991',
          classe_id: classeId
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('nom_eleve', 'Alioui');
    });
  });

  describe('GET /api/eleves', () => {
    it('should get all students', async () => {
      await Eleve.create({
        nom_eleve: 'Alioui',
        prenom_eleve: 'Mohamed',
        date_naissance: '2010-01-01',
        nom_parent: 'Mohamed Alioui',
        num_parent: '20778991',
        classe: classeId
      });

      const res = await request(app).get('/api/eleves');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });
});