const app = require('express')();
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const {
  handle400, handle404, handle422,
} = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle422);


module.exports = app;
