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
router.get('/:project_id/palettes', (req, res) => {
  const { project_id } = req.params;
  database('palettes')
    .where('project_id', project_id)
    .select()
    .then(palettes => {
      if (palettes.length) {
        return res.status(200).json(palettes);
      } else {
        return res.status(200).json({
          error: 'Could not find any palettes with that project id.'
        });
      }
    })
    .catch(err => res.send(500).json({ err }));
});

// post new palette to project
router.post('/:project_id/palettes/:name', (req, res) => {
  const newPalette = { ...req.body, ...req.params };

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
router.get('/palettes/:id', (req, res) => {
  res.send('get individual palette');
});

// delete palette
router.delete('/palettes/:palette_id', (req, res) => {
  console.log(req.params.palette_id);
  database('palettes')
    .where('id', req.params.palette_id)
    .del()
    .then(palette => res.status(200).json({ id: palette[0] }))
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
