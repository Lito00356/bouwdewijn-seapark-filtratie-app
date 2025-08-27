const tableName = "filters";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("sub_id").unsigned().notNullable();
    table.string("name", 255).notNullable();
    table.integer("is_active").notNullable().defaultTo(1);

    table.foreign("sub_id").references("sub_departments.id")
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
