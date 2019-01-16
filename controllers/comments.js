const connection = require('../connection');

exports.getCommentsByArticle = (req, res, next) => {
  const { limit = 10, sort_by = 'created_at', sort_order = 'desc' } = req.query;
  const offset = !req.query.p ? 0 : (req.query.p - 1) * limit;
  connection
    .select('comments.comments_id', 'comments.votes', 'comments.created_at', 'comments.username as author', 'comments.body')
    .from('comments')
    // .leftJoin('article', 'comment.article_id', '=', 'article.article_id')
    .where('article_id', '=', req.params.article_id)
    .limit(limit)
    .orderBy(sort_by, sort_order)
    .offset(offset)
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({
          msg: 'no article found',
          code: 404,
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
  connection
    .insert({
      article_id: req.params.article_id,
      username: req.body.username,
      body: req.body.body,
    })
    .into('comments').returning('*')
    .then(([comment]) => res.status(201).send({
      comment,
    }))
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  console.log(req.params)
  connection('comments')
    .where('comments_id', '=', req.params.comments_id)
    .increment('votes', req.body.inc_votes).returning('*')
    .then(([comment]) => res.status(202).send(
      {
        comment,
      }
    ))
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  connection('comments')
    .where('comments_id', req.params.comments_id)
    .del().returning('*')
    .then(() => res.sendStatus(204))
    .catch(next);
};