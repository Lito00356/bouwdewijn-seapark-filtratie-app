const tableName = "actions";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      name: "Check pre-filters pumps",
      object_type: "pump",
      frequency: "daily",
      is_active: 1,
    },
    {
      name: "Fill chlorine day tank",
      object_type: "sub_department",
      frequency: "daily",
      is_active: 1,
    },
    {
      name: "Fill sulfuric acid day tank",
      object_type: "sub_department",
      frequency: "daily",
      is_active: 1,
    },
    {
      name: "Fill Locron day tank",
      object_type: "sub_department",
      frequency: "daily",
      is_active: 1,
    },
    {
      name: "Vacuum clean",
      object_type: "sub_department",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Diving",
      object_type: "sub_department",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Cleaning pre-filter Depolox",
      object_type: "sub_department",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Cleaning sight glass pre-filter",
      object_type: "pump",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Check storage tank level ",
      object_type: "department",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Replenish chemical barrels ZL/AQ",
      object_type: "department",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Empty quarantine",
      object_type: "sub_department",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Remove salt deposits",
      object_type: "sub_department",
      frequency: "monthly",
      is_active: 1,
    },
    {
      name: "Clean vents",
      object_type: "filter",
      frequency: "monthly",
      is_active: 1,
    },
    {
      name: "Sump pump drain",
      object_type: "department",
      frequency: "monthly",
      is_active: 1,
    },
    {
      name: "Clean Depolox display",
      object_type: "sub_department",
      frequency: "monthly",
      is_active: 1,
    },
    {
      name: "Backwash (BW)",
      object_type: "filter",
      frequency: "weekly",
      is_active: 1,
    },
    {
      name: "Depolox calibration",
      object_type: "sub_department",
      frequency: "as_needed",
      is_active: 1,
    },
    {
      name: "Water analyses",
      object_type: "sub_department",
      frequency: "daily",
      is_active: 1,
    },
  ]);
};

export { seed };
