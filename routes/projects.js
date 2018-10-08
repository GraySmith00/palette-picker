// requiring express package
const express = require('express');
// creating new instance of the express router class
const router = express.Router();
// setting the node environment
const environment = process.env.NODE_ENV || 'development';
// requiring the configuration from the knexfile depending on the environment
const configuration = require('../knexfile')[environment];
// creating the database variable from the knex config
const database = require('knex')(configuration);

// get all projects
router.get('/', (req, res) => {
  // calling the projects table on the knex database
  database('projects')
    // selecting all projects
    .select()
    // sending all projects with ok status
    .then(projects => res.status(200).json(projects))
    // sending error status 500 internal server error
    .catch(err => res.status(500).json({ error }));
});

// project post request
router.post('/', (req, res) => {
  // grabbing the project object from request.body using bodyparser
  const project = req.body;

  // if the project object is missing a name return a 422 missing property
  if (!project.name) {
    return res
      .status(422)
      .send(
        `Expected format: { name: <String> }. You're missing a "name" property.`
      );
  }

  // grab projects table
  database('projects')
    // all records where name === project.name
    .where('name', project.name)
    .then(response => {
      // if there is a record in the response that means the name already exists
      if (response.length > 0) {
        // send a 409 with an error that says that project already exists
        return res
          .status(409)
          .send({ error: 'A project with that name already exists.' });
      } else {
        // insert a new project record into the database
        database('projects')
          .insert(project, 'id')
          // send back an ok status with the project id
          .then(project => res.status(201).json({ id: project[0] }))
          // send back an internal server error message
          .catch(err => res.status(500).json({ error }));
      }
    });
});

// get all palettes in a project
router.get('/:project_id/palettes', (req, res) => {
  // grab project id from the url
  const { project_id } = req.params;

  // grab palettes table
  database('palettes')
    // grab all records that match the project_id
    .where('project_id', project_id)
    .select()
    .then(palettes => {
      // if these records exist send them back to the frontend
      if (palettes.length) {
        return res.status(200).json(palettes);
      } else {
        // if no palettes exist send back none were found, wasn't sure whether to put a 404 here, not really an error, these projects just don't have any palettes yet
        return res.status(200).json({
          error: 'Could not find any palettes with that project id.'
        });
      }
    })
    // send internal server error if something went wrong
    .catch(err => res.send(500).json({ err }));
});

// post new palette to project
router.post('/:project_id/palettes/:name', (req, res) => {
  // create new palette with info from the body and the url
  const newPalette = { ...req.body, ...req.params };

  // check to see whether there are any missing properties in the newPalette
  for (let requiredParam of [
    'project_id',
    'name',
    'color0',
    'color1',
    'color2',
    'color3',
    'color4'
  ]) {
    // if there are missing fields send back an error message 422
    if (!newPalette[requiredParam]) {
      return res.status(422).send({
        error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParam}" property.`
      });
    }
  }

  // grab palettes table
  database('palettes')
    // insert the new palette
    .insert(newPalette, 'id')
    // send back status ok with the new palette id
    .then(palette => res.status(201).json({ id: palette[0] }))
    // send back internal server error
    .catch(err => res.status(500).json({ err }));
});

// delete palette
router.delete('/palettes/:palette_id', (req, res) => {
  // find the palette that matches the id in the path
  const foundPalette = database('palettes').where('id', req.params.palette_id);

  // if no palette exists with that id return a 404
  if (!foundPalette) {
    return res
      .status(404)
      .json({ error: `No palette was found with the id of ${req.params.id}` });
  }

  // delete the palette that matches the id
  foundPalette
    .del()
    // send back the deleted palette id
    .then(palette => res.status(200).json({ id: palette[0] }))
    // send internal server error
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
