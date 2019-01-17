const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topics');
const articlesRouter = require('../routes/articles');
const usersRouter = require('../routes/users');
const getEndPoints = require('../controllers/api');
const {
  handle405,
} = require('../errors');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

apiRouter
  .route('/')
  .get(getEndPoints)
  .all(handle405);

module.exports = apiRouter;
