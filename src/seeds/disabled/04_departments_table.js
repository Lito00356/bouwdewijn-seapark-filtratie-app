const tableName = "departments";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { name: "Dolphins", is_active: 1 },
    { name: "Sea lions", is_active: 1 },
    { name: "Seals", is_active: 1 },
    { name: "Aquasplash", is_active: 1 },
  ]);
};

export { seed };
