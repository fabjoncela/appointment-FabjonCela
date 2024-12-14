exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table
      .enum("role", ["customer", "provider", "admin"])
      .defaultTo("customer")
      .alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.enum("role", ["customer", "provider"]).defaultTo("customer").alter();
  });
};
