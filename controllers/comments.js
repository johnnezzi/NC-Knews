const connection = require('../connection');

exports.getCommentsByArticle = (req, res, next) => {
  const allowedSorts = ['article_id', 'title', 'votes', 'topic', 'username', 'created_at', 'comments_id'];
  const { sort_order = 'desc' } = req.query;
  const limit = Number.isNaN(+req.query.limit) ? 1000 : req.query.limit;
  const sort_by = !allowedSorts.includes(req.query.sort_by) ? 'created_at' : req.query.sort_by;
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
  const { inc_votes = 0 } = req.body;
  const { comments_id, article_id } = req.params;
  connection('comments')
    .where({
      article_id,
      comments_id,
    })
    .increment('votes', inc_votes).returning('*')
    .then(([comment]) => {
      if (Number.isNaN(+comments_id) || Number.isNaN(+article_id)) {
        return Promise.reject({
          msg: 'no article found',
          code: 400,
        });
      }
      if (!comment) {
        return Promise.reject({
          msg: 'no comment found',
          code: 404,
        });
      }
      res.status(200).send(
        {
          comment,
        },
      );
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comments_id, article_id } = req.params;
  connection('comments')
    .where({
      article_id,
      comments_id,
    })
    .del().returning('*')
    .then((res) => {
      console.log(res)
      const [comment] = res
      if (!comment) {
        return Promise.reject({
          msg: 'no comment found',
          code: 404,
        });
      }
      res.sendStatus(204);
    })
    .catch(next);
};
