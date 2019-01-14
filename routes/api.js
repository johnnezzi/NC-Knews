const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topics');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;