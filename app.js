const app = require('express')();
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const {
  handle400, handle404, handle422, handle500,
} = require('./errors');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use(handle500);


module.exports = app;
