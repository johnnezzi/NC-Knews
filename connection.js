const ENV = process.env.NODE_ENV || 'development';
const dbConfig = require('./knexfile')[ENV];
const knex = require('knex');

const connection = knex(dbConfig);

module.exports = connection;
