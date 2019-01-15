const app = require('express')();
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const {
  handle400, handle404,
} = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);

module.exports = app;
