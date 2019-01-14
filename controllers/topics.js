const connection = require('../connection');

exports.getTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then(topics => res.status(200).send({ topics }))
    .catch(err => console.log(err))
}