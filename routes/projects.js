const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
});

// get all projects
router.get('/projects', (req, res) => {
  res.send('projects');
});

// project post request
router.post('/projects', (req, res) => {
  res.send('projects post request');
});

// get individual project
router.get('/projects/:id', (req, res) => {
  res.send(`project id: ${req.params.id}`);
});

// get all palettes in a project
router.get('/projects/:id/palettes', (req, res) => {
  res.send('get all palettes');
});

// post new palette to project
router.post('/projects/:id/palettes', (req, res) => {
  res.send('palette post request');
});

// get individual palette
router.get('/projects/:id/palettes/:id', (req, res) => {
  res.send('get individual palette');
});

// delete palette
router.delete('/projects/:id/palettes/:palette_id', (req, res) => {
  res.send('delete palette');
});

module.exports = router;
