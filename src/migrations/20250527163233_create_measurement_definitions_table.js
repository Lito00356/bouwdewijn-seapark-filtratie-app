const tableName = "measurement_definitions";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("short_name").notNullable();
    table.string("unit").notNullable();
    table.float("min_value").nullable();
    table.float("max_value").nullable();
    table.string("measurement_key").nullable()
    table.integer("is_active").notNullable().defaultTo(1);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
