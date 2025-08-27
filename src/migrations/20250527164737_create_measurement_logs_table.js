const tableName = "measurement_logs";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary(),
    table.integer("user_id").unsigned().notNullable();
    table.integer("sub_id").unsigned().notNullable();
    table.dateTime("measured_at").defaultTo(knex.fn.now());
    table.string("measurements").notNullable();
    table.enu("comment_type", ["error", "observation", "other"]).nullable();
    table.text("comment").nullable();

    table.foreign("user_id").references("users.id");
    table.foreign("sub_id").references("sub_departments.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
