const tableName = "notifications";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      title: "PDF1 - Check pre-filters pumps",
      message: "Pressure readings normal",
      comment_type: "observation",
      is_read: false,
      created_at: "2025-06-14 08:15:32",
      updated_at: "2025-06-14 08:15:32",
    },
    {
      title: "Inside pool - Vacuum clean",
      message: "Found debris near entrance",
      comment_type: "observation",
      is_read: false,
      created_at: "2025-06-14 10:45:15",
      updated_at: "2025-06-14 10:45:15",
    },
    {
      title: "Quarantaine - Fill chlorine day tank",
      message: "Tank was at 25% capacity",
      comment_type: "observation",
      is_read: true,
      created_at: "2025-06-14 16:10:45",
      updated_at: "2025-06-15 09:20:12",
    },
    {
      title: "Window - Diving",
      message: "Cleaned algae buildup on viewing windows",
      comment_type: "observation",
      is_read: false,
      created_at: "2025-06-15 11:30:22",
      updated_at: "2025-06-15 11:30:22",
    },
    {
      title: "Backpool - Depolox calibration",
      message: "Calibration required adjustment",
      comment_type: "error",
      is_read: false,
      created_at: "2025-06-15 13:15:18",
      updated_at: "2025-06-15 13:15:18",
    },
    {
      title: "PAQ1 - Check pre-filters pumps",
      message: "Slight vibration detected",
      comment_type: "error",
      is_read: false,
      created_at: "2025-06-15 08:20:33",
      updated_at: "2025-06-15 08:20:33",
    },
    {
      title: "Measurement Frontpool",
      message: "Total chlorine elevated",
      comment_type: "error",
      is_read: true,
      created_at: "2025-06-04 08:30:45",
      updated_at: "2025-06-04 10:15:22",
    },
    {
      title: "Measurement Quarantaine",
      message: "pH slightly low",
      comment_type: "error",
      is_read: false,
      created_at: "2025-06-05 16:30:18",
      updated_at: "2025-06-05 16:30:18",
    },
    {
      title: "Measurement Backpool",
      message: "Temperature running low",
      comment_type: "other",
      is_read: false,
      created_at: "2025-06-06 10:00:55",
      updated_at: "2025-06-06 10:00:55",
    },
    {
      title: "Measurement Inside pool",
      message: "Temperature elevated",
      comment_type: "error",
      is_read: false,
      created_at: "2025-06-08 12:30:40",
      updated_at: "2025-06-08 12:30:40",
    },
    {
      title: "Measurement Quarantaine",
      message: "pH slightly acidic",
      comment_type: "observation",
      is_read: true,
      created_at: "2025-06-10 17:20:12",
      updated_at: "2025-06-11 08:45:33",
    },
  ]);
};

export { seed };
