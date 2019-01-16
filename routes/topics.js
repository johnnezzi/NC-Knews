const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topics');
const {
  getArticlesByTopic,
  postArticlesToTopic,
} = require('../controllers/articles');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticlesToTopic);

module.exports = topicsRouter;
