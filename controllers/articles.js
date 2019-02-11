const connection = require('../connection');

exports.getArticles = (req, res, next) => {
  const allowedSorts = ['article_id', 'title', 'votes', 'topic', 'username'];
  const { sort_order = 'desc' } = req.query;
  const limit = Number.isNaN(+req.query.limit) ? 1000 : req.query.limit;
  const sort_by = !allowedSorts.includes(req.query.sort_by) ? 'created_at' : req.query.sort_by;
  const offset = !req.query.p ? 0 : (req.query.p - 1) * limit;
  connection
    .select('articles.article_id', 'articles.title', 'articles.votes', 'articles.topic', 'articles.username as author', 'articles.created_at')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .count('comments.comments_id as comment_count')
    .groupBy('articles.article_id')
    .limit(limit)
    .orderBy(sort_by, sort_order)
    .offset(offset)
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const allowedSorts = ['article_id', 'title', 'votes', 'topic', 'username', 'created_at'];
  const { sort_order = 'desc' } = req.query;
  const limit = Number.isNaN(+req.query.limit) ? 1000 : req.query.limit;
  const offset = !req.query.p ? 0 : (req.query.p - 1) * limit;
  const sort_by = !allowedSorts.includes(req.query.sort_by) ? 'created_at' : req.query.sort_by;
  connection
    .select('articles.article_id', 'articles.title', 'articles.votes', 'articles.topic', 'articles.username as author', 'articles.created_at')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .where('topic', req.params.topic)
    .count('comments.comments_id as comment_count')
    .groupBy('articles.article_id')
    .limit(limit)
    .orderBy(sort_by, sort_order)
    .offset(offset)
    .then((articles) => {
      if (!articles.length) {
        return Promise.reject({
          message: 'no article found',
          code: 404,
        });
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  connection
    .select('articles.article_id', 'articles.title', 'articles.votes', 'articles.topic', 'articles.username as author', 'articles.created_at', 'articles.body')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .where('articles.article_id', req.params.article_id)
    .count('comments.comments_id as comment_count')
    .groupBy('articles.article_id')
    // \\ if no articles promise.reject
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          code: 404,
          message: 'No article found',
        });
      } res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticlesToTopic = (req, res, next) => {
  connection
    .insert({
      ...req.body,
      ...req.params,
    })
    .into('articles').returning('*')
    .then(([article]) => res.status(201).send({
      article,
    }))
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const {
    inc_votes = 0
  } = req.body;
  connection('articles')
    .where('article_id', '=', req.params.article_id)
    .increment('votes', inc_votes).returning('*')
    .then(([article]) => {
      if (!inc_votes) return res.status(200).send({
        article,
      });
      if (Number.isNaN(+inc_votes)) {
        return Promise.reject({
          msg: 'no article found',
          code: 400,
        });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  connection('articles')
    .where('article_id', req.params.article_id)
    .del()
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({
          msg: 'no article found',
          code: 404,
        });
      }
      res.status(204).send({});
    })
    .catch(next);
};
