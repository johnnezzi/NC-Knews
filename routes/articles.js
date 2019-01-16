const articlesRouter = require('express').Router();
const {
  getCommentsByArticle, postCommentToArticle, patchComment, deleteComment,
} = require('../controllers/comments');
const {
  getArticles, getArticleById, patchArticle, deleteArticle,
} = require('../controllers/articles');

articlesRouter
  .route('/')
  .get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle);

articlesRouter
  .route('/:article_id/comments/')
  .get(getCommentsByArticle)
  .post(postCommentToArticle)
  .patch(patchComment);

articlesRouter
  .route('/:article_id/comments/:comments_id')
  .patch(patchComment)
  .delete(deleteComment);

module.exports = articlesRouter;
