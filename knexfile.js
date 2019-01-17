module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_news_2',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'nc_news_2_test',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
};
