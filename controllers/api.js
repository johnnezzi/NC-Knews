const endPointsData = require('../db/data/endpoints');

function getEndPoints(req, res, next) {
  res.status(200).send({ endPointsData })
    .catch(next);
}

module.exports = getEndPoints;
