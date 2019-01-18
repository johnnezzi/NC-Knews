const articlesRouter = require('express').Router();
const {
  getCommentsByArticle, postCommentToArticle, patchComment, deleteComment,
} = require('../controllers/comments');
const {
  getArticles, getArticleById, patchArticle, deleteArticle,
} = require('../controllers/articles');

const {
  handle405,
} = require('../errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(handle405);


articlesRouter
  .route('/:article_id/comments/')
  .get(getCommentsByArticle)
  .post(postCommentToArticle)
  .patch(patchComment)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comments_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405);

module.exports = articlesRouter;
