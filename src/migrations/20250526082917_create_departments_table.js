const tableName = "departments";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.integer("is_active").notNullable().defaultTo(1);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
