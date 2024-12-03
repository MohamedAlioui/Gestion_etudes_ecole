const { describe, it, expect, beforeEach, afterEach } = require('vitest');
const request = require('supertest');
const app = require('../src/server');
const Classe = require('../src/models/Classe');
const mongoose = require('mongoose');

describe('Classe API', () => {
  beforeEach(async () => {
    await Classe.deleteMany({});
  });

  afterEach(async () => {
    await Classe.deleteMany({});
  });

  describe('POST /api/classes', () => {
    it('should create a new class', async () => {
      const res = await request(app)
        .post('/api/classes')
        .send({
          niveau_classe: '7éme année',
          nom_classe: '7b7'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('niveau_classe', '7éme année');
      expect(res.body).toHaveProperty('nom_classe', '7b7');
    });
  });

  describe('GET /api/classes', () => {
    it('should get all classes', async () => {
      await Classe.create({
        niveau_classe: '7éme année',
        nom_classe: '7b7'
      });

      const res = await request(app).get('/api/classes');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/classes/:id', () => {
    it('should get a class by id', async () => {
      const classe = await Classe.create({
        niveau_classe: '7éme année',
        nom_classe: '7b7'
      });

      const res = await request(app).get(`/api/classes/${classe._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', classe._id.toString());
    });
  });

  describe('PUT /api/classes/:id', () => {
    it('should update a class', async () => {
      const classe = await Classe.create({
        niveau_classe: '7éme année',
        nom_classe: '7b7'
      });

      const res = await request(app)
        .put(`/api/classes/${classe._id}`)
        .send({
          nom_classe: '7b8'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('nom_classe', '7b8');
    });
  });

  describe('DELETE /api/classes/:id', () => {
    it('should delete a class', async () => {
      const classe = await Classe.create({
        niveau_classe: '7éme année',
        nom_classe: '7b7'
      });

      const res = await request(app).delete(`/api/classes/${classe._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Class deleted');
    });
  });
});