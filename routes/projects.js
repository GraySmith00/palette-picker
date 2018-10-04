const express = require('express');
const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// get all projects
router.get('/', (req, res) => {
  // res.json({ projects: ['proj1', 'proj2'] });
  database('projects')
    .select()
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(500).json({ error }));
});

// project post request
router.post('/', (req, res) => {
  const project = req.body;

  if (!project.name) {
    return res
      .status(422)
      .send(
        `Expected format: { name: <String> }. You're missing a "name" property.`
      );
  }

  database('projects')
    .insert(project, 'id')
    .then(project => res.status(201).json({ id: project[0] }))
    .catch(err => res.status(500).json({ error }));
});

// get individual project
router.get('/:id', (req, res) => {
  res.send(`project id: ${req.params.id}`);
});

// get all palettes in a project
router.get('/:id/palettes', (req, res) => {
  res.send('get all palettes');
});

// post new palette to project
router.post('/:id/palettes', (req, res) => {
  res.send('palette post request');
});

// get individual palette
router.get('/:id/palettes/:id', (req, res) => {
  res.send('get individual palette');
});

// delete palette
router.delete('/:id/palettes/:palette_id', (req, res) => {
  res.send('delete palette');
});

module.exports = router;
