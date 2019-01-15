exports.handle400 = (err, req, res, next) => {
  // console.log(err)
  const codes = {
    42703: 'Bad Request, Invalid object structure provided',
    23505: 'Bad Request, Duplicate value supplied',
  };
  if (codes[err.code]) {
    res.status(400).send({
      message: codes[err.code],
    });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.code === 404) res.status(404).send({
    message: err.message,
  });
  else next(err);
};