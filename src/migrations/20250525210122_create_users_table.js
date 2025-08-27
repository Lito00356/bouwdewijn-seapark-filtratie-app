const tableName = "users";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("firstname", 255).notNullable();
    table.string("lastname", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("pin", 255).notNullable();
    table.integer('is_admin').notNullable().defaultTo(0);
    table.integer("is_active").notNullable().defaultTo(1);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
