const express = require('express');
const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// get all projects
router.get('/', (req, res) => {
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
router.post('/:project_id/palettes/:name', (req, res) => {
  const colors = req.body.reduce((colors, color, i) => {
    colors[`color${i}`] = color;
    return colors;
  }, {});
  const newPalette = { ...colors, ...req.params };
  console.log(newPalette);
  for (let requiredParam of [
    'project_id',
    'name',
    'color0',
    'color1',
    'color2',
    'color3',
    'color4'
  ]) {
    if (!newPalette[requiredParam]) {
      return res.status(422).send({
        error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParam}" property.`
      });
    }
  }

  database('palettes')
    .insert(newPalette, 'id')
    .then(palette => res.status(201).json({ id: palette[0] }))
    .catch(err => res.status(500).json({ err }));
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
