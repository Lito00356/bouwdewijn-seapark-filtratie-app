export const up = async (knex) => {
  await knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable(); // System-Action or Measurement-Subdepartment
    table.text("message").notNullable(); // The actual comment content
    table.enu("comment_type", ["error", "observation", "other"]).nullable();
    table.boolean("is_read").defaultTo(false); // Global read status
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["created_at"]);
    table.index(["is_read"]);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists("notifications");
};
