const express = require('express');
const app = express();

const projects = require('./routes/projects');
app.use('/api/v1/projects', projects);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}`);
});
