

exports.getEndpoints = (req, res, next) => {
  () => res.status(200).send({
    '/topics': 'Responds with all of the topics',
    '/api/topics/:topic/articles': 'Responds with all the articles for a given topic',
    '/api/articles': 'Responds with all the articles',
    '/api/articles/:article_id': 'Responds with a specific article',
    '/api/articles/:aricle_id/comments': 'Responds with all comments for a given article',
    '/api/users': 'Responds with all the users',
    '/api/users/:username': 'Responds with a specific user',
    });
};
