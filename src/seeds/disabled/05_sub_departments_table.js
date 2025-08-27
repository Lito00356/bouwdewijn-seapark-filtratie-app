const tableName = "sub_departments";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { name: "Frontpool", department_id: 1, is_active: 1 },
    { name: "Backpool", department_id: 1, is_active: 1 },
    { name: "Outside pool", department_id: 2, is_active: 1 },
    { name: "Inside pool", department_id: 2, is_active: 1 },
    { name: "Quarantaine", department_id: 2, is_active: 1 },
    { name: "Window", department_id: 3, is_active: 1 },
    { name: "House", department_id: 3, is_active: 1 },
    { name: "Aquasplash", department_id: 4, is_active: 1 },
  ]);
};

export { seed };
