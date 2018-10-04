const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// use static assets
app.use(express.static('public'));

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
const projects = require('./routes/projects');
app.use('/api/v1/projects', projects);

// app listening
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}`);
});
