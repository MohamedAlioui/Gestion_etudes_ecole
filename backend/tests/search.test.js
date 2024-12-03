const { describe, it, expect, beforeEach, afterEach } = require('vitest');
const request = require('supertest');
const app = require('../src/server');
const Eleve = require('../src/models/Eleve');
const Classe = require('../src/models/Classe');

describe('Search API', () => {
  let classeId;

  beforeEach(async () => {
    const classe = await Classe.create({
      niveau_classe: '7éme année',
      nom_classe: '7b7'
    });
    classeId = classe._id;

    await Eleve.create([
      {
        nom_eleve: 'Alioui',
        prenom_eleve: 'Mohamed',
        date_naissance: '2010-01-01',
        nom_parent: 'Mohamed Alioui',
        num_parent: '20778991',
        classe: classeId
      },
      {
        nom_eleve: 'Ben Ali',
        prenom_eleve: 'Ahmed',
        date_naissance: '2010-02-01',
        nom_parent: 'Ali Ben Ali',
        num_parent: '20778992',
        classe: classeId
      }
    ]);
  });

  afterEach(async () => {
    await Eleve.deleteMany({});
    await Classe.deleteMany({});
  });

  describe('GET /api/search/eleves', () => {
    it('should search students by name', async () => {
      const res = await request(app)
        .get('/api/search/eleves')
        .query({ nom: 'ali' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should filter students by class', async () => {
      const res = await request(app)
        .get('/api/search/eleves')
        .query({ classe: classeId });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});