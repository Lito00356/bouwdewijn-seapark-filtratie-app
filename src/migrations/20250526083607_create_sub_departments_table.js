const tableName = "sub_departments";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("department_id").unsigned().notNullable();
    table.string("name", 255).notNullable();
    table.integer("is_active").notNullable().defaultTo(1);

    table.foreign("department_id").references("departments.id")
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
