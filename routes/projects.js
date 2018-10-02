const express = require('express');
const router = express.Router();

// get all projects
router.get('/', (req, res) => {
  res.send('projects');
});

// project post request
router.post('/', (req, res) => {
  console.log(req.body);
  res.send('worked');
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
