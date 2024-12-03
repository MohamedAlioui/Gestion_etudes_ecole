const { body } = require('express-validator');

const classeValidators = {
  create: [
    body('niveau_classe').notEmpty().withMessage('Class level is required'),
    body('nom_classe').notEmpty().withMessage('Class name is required')
  ]
};

const eleveValidators = {
  create: [
    body('nom_eleve').notEmpty().withMessage('Student last name is required'),
    body('prenom_eleve').notEmpty().withMessage('Student first name is required'),
    body('date_naissance').isISO8601().withMessage('Valid birth date is required'),
    body('nom_parent').notEmpty().withMessage('Parent name is required'),
    body('num_parent').notEmpty().withMessage('Parent phone number is required'),
    body('classe_id').isMongoId().withMessage('Valid class ID is required')
  ]
};

const enseignantValidators = {
  create: [
    body('nom_enseignant').notEmpty().withMessage('Teacher last name is required'),
    body('prenom_enseignant').notEmpty().withMessage('Teacher first name is required'),
    body('matiere').notEmpty().withMessage('Subject is required')
  ]
};

const etudeValidators = {
  create: [
    body('matiere').notEmpty().withMessage('Subject is required'),
    body('niveau').notEmpty().withMessage('Level is required'),
    body('enseignant_id').isMongoId().withMessage('Valid teacher ID is required')
  ]
};

const seanceValidators = {
  create: [
    body('date_seance').isISO8601().withMessage('Valid session date is required'),
    body('etude_id').isMongoId().withMessage('Valid study ID is required'),
    body('presences.*.eleve').isMongoId().withMessage('Valid student ID is required'),
    body('presences.*.status').isIn(['present', 'absent']).withMessage('Valid status is required')
  ]
};

const paiementValidators = {
  create: [
    body('etude_id').isMongoId().withMessage('Valid study ID is required'),
    body('total_administration').isNumeric().withMessage('Valid administration total is required'),
    body('total_enseignant').isNumeric().withMessage('Valid teacher total is required'),
    body('total_seances').isInt({ min: 1 }).withMessage('Valid number of sessions is required')
  ]
};

module.exports = {
  classeValidators,
  eleveValidators,
  enseignantValidators,
  etudeValidators,
  seanceValidators,
  paiementValidators
};