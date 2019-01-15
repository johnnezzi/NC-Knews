const connection = require('../connection');

exports.getTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  connection
    .insert(req.body)
    .into('topics').returning('*')
    .then(([topic]) => res.status(201).send({ topic }))
    .catch(next);
};
