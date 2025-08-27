const tableName = "filters";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { name: "FD1", sub_id: 1, is_active: 1 },
    { name: "FD2", sub_id: 1, is_active: 1 },
    { name: "FD3", sub_id: 1, is_active: 1 },
    { name: "FD4", sub_id: 1, is_active: 1 },
    { name: "FD5", sub_id: 1, is_active: 1 },
    { name: "FD6", sub_id: 1, is_active: 1 },
    { name: "FD7", sub_id: 2, is_active: 1 },
    { name: "FD8", sub_id: 2, is_active: 1 },
    { name: "FSL1", sub_id: 3, is_active: 1 },
    { name: "FSL2", sub_id: 4, is_active: 1 },
    { name: "FSL3", sub_id: 4, is_active: 1 },
    { name: "FSLQ", sub_id: 5, is_active: 1 },
    { name: "FS1", sub_id: 6, is_active: 1 },
    { name: "FS2", sub_id: 7, is_active: 1 },
    { name: "FAQ1", sub_id: 8, is_active: 1 },
  ]);
};

export { seed };
