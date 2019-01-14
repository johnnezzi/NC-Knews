
const {
  topicData, articleData, userData, commentData,
} = require('../data/index');
const { formatArticles, formatComments } = require('../utils');

exports.seed = function (knex, Promise) {
  return knex('topics')
    .insert(topicData)
    .then(() => knex('users').insert(userData))
    .then(() => {
      const formattedArticles = formatArticles(articleData);
      return knex('articles').insert(formattedArticles).returning('*');
    })
    .then((articles) => {
      const formattedComments = formatComments(commentData, articles);
      return knex('comments').insert(formattedComments);
    });
};
