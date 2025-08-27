const tableName = "pumps";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { name: "PDF1", sub_id: 1, is_active: 1 },
    { name: "PDF2", sub_id: 1, is_active: 1 },
    { name: "PDF3", sub_id: 1, is_active: 1 },
    { name: "PDB1", sub_id: 2, is_active: 1 },
    { name: "PFB2", sub_id: 2, is_active: 1 },
    { name: "PSL1", sub_id: 3, is_active: 1 },
    { name: "PSL2", sub_id: 4, is_active: 1 },
    { name: "PSL3", sub_id: 4, is_active: 1 },
    { name: "PSLQ", sub_id: 5, is_active: 1 },
    { name: "PS1", sub_id: 6, is_active: 1 },
    { name: "PS2", sub_id: 7, is_active: 1 },
    { name: "PAQ1", sub_id: 8, is_active: 1 },
    { name: "PAQ2", sub_id: 8, is_active: 1 },
    { name: "PAQ3", sub_id: 8, is_active: 1 },
    { name: "PAQ4", sub_id: 8, is_active: 1 },
  ]);
};

export { seed };
