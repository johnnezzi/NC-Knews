const connection = require('../connection');

exports.getArticlesByTopic = (req, res, next) => {
  // const offset = !req.query.p ? 0 : (req.query.p - 1) * 10;
  // const limit = !req.query.limit ? 10 : req.query.limit;
  // const sortBy = !req.query.sort_by ? 'created_at' : req.query.sort_by;
  // const sortOrder = !req.query.sort ? 'asc' : 'desc';

   const offset = !req.query.p ? 0 : (req.query.p - 1) * 10;
   const limit = req.query.limit || 10; 
   const sortBy = req.query.sort_by || 'created_at';
   const sortOrder = req.query.sort || 'desc';


  connection
    .select('articles.article_id', 'articles.title', 'articles.votes', 'articles.topic', 'articles.username as author', 'articles.created_at')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .where('topic', req.params.topic)
    .count('comments.comments_id as comment_count')
    .groupBy('articles.article_id')
    .limit(limit)
    .orderBy(sortBy, sortOrder)
    .offset(offset)
    .then((articles) => {
      if (!articles.length) {
        return Promise.reject({
          message: 'no article found',
          code: 404,
        });
      }
      res.status(200).send(articles);
    })
    .catch(next);
};
