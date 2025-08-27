const tableName = "actions";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.enu("object_type", ["filter", "pump", "department", "sub_department"]).notNullable();
    table.enu("frequency", ["daily", "weekly", "monthly", "as_needed"]).notNullable();
    table.integer("is_active").notNullable().defaultTo(1);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
