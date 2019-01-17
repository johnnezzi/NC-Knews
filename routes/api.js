const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topics');
const articlesRouter = require('../routes/articles');
const usersRouter = require('../routes/users');
const getEndPoints = require('../controllers/api');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

apiRouter
  .route('/')
  .get(getEndPoints);

module.exports = apiRouter;
