
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('comments_id').primary().notNullable();
    table.string('username').references('users.username').notNullable();
    table.integer('article_id').references('articles.article_id');
    table.integer('votes').defaultsTo(0).notNullable();
    table.timestamp('created_at').notNullable();
    table.string('body', 2000).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
