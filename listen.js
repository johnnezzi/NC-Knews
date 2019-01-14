const PORT = process.env.PORT || 9090;
const app = require('./app');

app.listen(PORT, () => {
  console.log(`listening on ${PORT}.....`);
});
