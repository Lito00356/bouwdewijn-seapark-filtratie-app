const tableName = "task_logs";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('action_id').unsigned().notNullable();
    table.enu("object_type", ["filter", "pump", "department", "sub_department"]).notNullable();
    table.string("object_name").notNullable();
    table.enu("comment_type", ["error", "observation", "other"]).nullable();
    table.text("comment").nullable();
    table.dateTime('performed_at').defaultTo(knex.fn.now());
    table.integer("is_complete").defaultTo(0);

    table.foreign('user_id').references('users.id')
    table.foreign('action_id').references('actions.id')

  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
