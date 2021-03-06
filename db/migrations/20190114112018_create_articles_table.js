
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table.increments('article_id').primary().notNullable();
    table.string('title').notNullable();
    table.string('body', 2000).notNullable();
    table.integer('votes').defaultTo(0).notNullable();
    table.string('topic').references('topics.slug').notNullable();
    table.string('username').references('users.username').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
