// requiring the express package into the server file
const express = require('express');
// creating a new instance of the express class that gives us access to its methods
const app = express();
// requiring bodyParser package which gives us access to incoming post request bodies
const bodyParser = require('body-parser');

// use static assets like index.html, index.js, styles.css
app.use(express.static('public'));

// bodyParser
// allows for urlencoded data to be parsed by looking at content-type, nice to use with postman
app.use(bodyParser.urlencoded({ extended: false }));
// allows for raw json data to be parsed
app.use(bodyParser.json());

// routes
// requiring my projects routes file
const projects = require('./routes/projects');
// setting the prefix path to all of the routes in my projects routes file
app.use('/api/v1/projects', projects);

// app listening
// setting app port to process.env.PORT and defaulting to 3000 if it has not been set
app.set('port', process.env.PORT || 3000);
// setting the port for the app to listen on and logging the port that the app is running on
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}`);
});

// routes files also annotated
