
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.string('username').unique().primary().notNullable();
    table.string('avatar_url');
    table.string('name').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
