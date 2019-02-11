exports.handle400 = (err, req, res, next) => {
  const codes = {
    42703: 'Bad Request, Invalid object structure provided',
    23502: 'Missing mandatory field',
    '22P02': 'Invalid input format',
    400: 'Invalid input format',
    23503: 'Bad Request, Not found',
  };
  if (codes[err.code]) {
    res.status(400).send({
      message: codes[err.code],
    });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.code === 404) res.status(404).send({
    message: err.msg || err.message,
  });
  else next(err);
};

exports.handle422 = (err, req, res, next) => {
  const codes = {
    23505: 'Bad Request, Duplicate key violation',
  };
  if (codes[err.code]) {
    res.status(422).send({
      message: codes[err.code],
    });
  } else next(err);
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({
    message: 'Invalid method for this endpoint',
  });
};

exports.handle500 = (req, res, next) => {
  res.status(500).send({
    message: 'Internal Server Error',
  });
};
