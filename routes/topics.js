const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topics');
const {
  getArticlesByTopic,
  postArticlesToTopic,
} = require('../controllers/articles');
const { handle405 } = require('../errors');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticlesToTopic);

module.exports = topicsRouter;
