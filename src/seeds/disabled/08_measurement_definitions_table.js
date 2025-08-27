const tableName = "measurement_definitions";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      name: "Free chlorine",
      short_name: "F Cl",
      unit: "mg/l",
      measurement_key: "freeChlorine",
      is_active: 1,
    },
    {
      name: "Free chlorine Depolox",
      short_name: "F Cl Depo",
      unit: "mg/l",
      measurement_key: "freeChlorine_depo",
      is_active: 1,
    },
    {
      name: "Total chlorine",
      short_name: "Tot CL",
      unit: "mg/l",
      max_value: 0.8,
      measurement_key: "totalChlorine",
      is_active: 1,
    },
    {
      name: "Combined Chlorine",
      short_name: "Comb CL",
      unit: "mg/l",
      measurement_key: "combinedChlorine",
      is_active: 1,
    },
    {
      name: "pH",
      short_name: "pH",
      unit: "pH",
      min_value: 7.2,
      max_value: 8.4,
      measurement_key: "pH",
      is_active: 1,
    },
    {
      name: "pH Depolox",
      short_name: "pH Depo",
      unit: "pH",
      min_value: 7.2,
      max_value: 8.4,
      measurement_key: "pH_depo",
      is_active: 1,
    },
    {
      name: "Temperature",
      short_name: "Temp",
      unit: "°C",
      min_value: 14,
      max_value: 30,
      measurement_key: "temperature",
      is_active: 1,
    },
    {
      name: "Salinity",
      short_name: "Salt",
      unit: "ppt",
      min_value: 28,
      max_value: 38,
      measurement_key: "salinity",
      is_active: 1,
    },
    {
      name: "Total Coliforms",
      short_name: "Tot Col",
      unit: "C/100ml",
      max_value: 1000,
      measurement_key: "totalColiforms",
      is_active: 1,
    },
    {
      name: "E coli",
      short_name: "E col",
      unit: "C/100ml",
      max_value: 500,
      measurement_key: "eColi",
      is_active: 1,
    },
  ]);
};

export { seed };
