const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Cors
app.use(
  cors({
    allowedOrigins: ['localhost:3000']
  })
);
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

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
