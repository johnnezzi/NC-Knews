const connection = require('../connection');

exports.getUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then(users => res.status(200).send({
      users,
    }))
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  connection
    .select('*')
    .from('users')
    .where('username', '=', req.params.username)

    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          msg: 'no user found',
          code: 404,
        });
      }
      res.status(200).send({
        user,
      });
    })
    .catch(next);
};
