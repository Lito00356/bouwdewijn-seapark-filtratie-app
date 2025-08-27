const tableName = "task_logs";

const seed = async function (knex) {
  await knex(tableName).truncate();
  await knex(tableName).insert([
    {
      user_id: 1,
      action_id: 1,
      object_type: "pump",
      object_name: "PDF1",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-27 10:15:32",
      is_complete: 1,
    },
    {
      user_id: 2,
      action_id: 2,
      object_type: "sub_department",
      object_name: "Frontpool",
      comment: "Level was low.",
      comment_type: "error",
      performed_at: "2025-05-26 16:48:01",
      is_complete: 1,
    },
    {
      user_id: 3,
      action_id: 18,
      object_type: "sub_department",
      object_name: "Frontpool",
      comment: "Results within acceptable range.",
      comment_type: "observation",
      performed_at: "2025-05-28 08:02:59",
      is_complete: 1,
    },
    {
      user_id: 1,
      action_id: 5, // Vacuum clean
      object_type: "sub_department",
      object_name: "Backpool",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-25 19:21:44",
      is_complete: 1,
    },
    {
      user_id: 2,
      action_id: 16, // Backwash (BW)
      object_type: "filter",
      object_name: "FD1",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-24 11:55:18",
      is_complete: 1,
    },
    {
      user_id: 3,
      action_id: 9, // Check storage tank level
      object_type: "department",
      object_name: "Dolphins",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-28 14:30:05",
      is_complete: 0,
    },
    {
      user_id: 1,
      action_id: 12, // Remove salt deposits
      object_type: "sub_department",
      object_name: "Quarantaine",
      comment: "",
      comment_type: null,
      performed_at: "2025-04-29 07:09:27",
      is_complete: 1,
    },
    {
      user_id: 2,
      action_id: 13, // Clean vents
      object_type: "filter",
      object_name: "FSL1",
      comment: "",
      comment_type: null,
      performed_at: "2025-04-22 22:33:12",
      is_complete: 1,
    },
    {
      user_id: 3,
      action_id: 17, // Depolox calibration
      object_type: "sub_department",
      object_name: "Frontpool",
      comment: "Measurements were fluctuating.",
      comment_type: "error",
      performed_at: "2025-05-15 15:01:39",
      is_complete: 1,
    },
    {
      user_id: 1,
      action_id: 1, // Check pre-filters pumps
      object_type: "pump",
      object_name: "PDF2",
      comment: "Checked pressure.",
      comment_type: "observation",
      performed_at: "2025-05-27 09:42:51",
      is_complete: 1,
    },
    {
      user_id: 2,
      action_id: 16, // Backwash (BW)
      object_type: "filter",
      object_name: "FD2",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-26 17:10:23",
      is_complete: 0,
    },
    {
      user_id: 3,
      action_id: 15, // Clean Depolox display
      object_type: "sub_department",
      object_name: "Backpool",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-20 11:05:47",
      is_complete: 1,
    },
    {
      user_id: 1,
      action_id: 3, // Fill sulfuric acid day tank
      object_type: "sub_department",
      object_name: "Frontpool",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-28 10:58:03",
      is_complete: 1,
    },
    {
      user_id: 2,
      action_id: 10, // Replenish chemical barrels ZL/AQ
      object_type: "department",
      object_name: "Sea Lions",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-23 13:31:19",
      is_complete: 1,
    },
    {
      user_id: 3,
      action_id: 14, // Sump pump drain
      object_type: "filter",
      object_name: "FSL2",
      comment: "",
      comment_type: null,
      performed_at: "2025-05-21 06:27:35",
      is_complete: 0,
    },
    {
      user_id: 1,
      action_id: 1, // Check pre-filters pumps
      object_type: "pump",
      object_name: "PDF3",
      comment: "Pressure readings normal",
      comment_type: "observation",
      performed_at: "2025-06-14 08:15:00",
      is_complete: 1,
    },
    {
      user_id: 2,
      action_id: 18, // Water analyses
      object_type: "sub_department",
      object_name: "Outside pool",
      comment: "",
      comment_type: null,
      performed_at: "2025-06-14 09:30:00",
      is_complete: 1,
    },
    {
      user_id: 4,
      action_id: 5, // Vacuum clean
      object_type: "sub_department",
      object_name: "Inside pool",
      comment: "Found debris near entrance",
      comment_type: "observation",
      performed_at: "2025-06-14 10:45:00",
      is_complete: 1,
    },
    {
      user_id: 1,
      action_id: 16, // Backwash (BW)
      object_type: "filter",
      object_name: "FSL1",
      comment: "",
      comment_type: null,
      performed_at: "2025-06-14 14:20:00",
      is_complete: 1,
    },
    {
      user_id: 3,
      action_id: 2, // Fill chlorine day tank
      object_type: "sub_department",
      object_name: "Quarantaine",
      comment: "Tank was at 25% capacity",
      comment_type: "observation",
      performed_at: "2025-06-14 16:10:00",
      is_complete: 1,
    },
    {
      user_id: 5,
      action_id: 8, // Cleaning sight glass pre-filter
      object_type: "pump",
      object_name: "PSL1",
      comment: "",
      comment_type: null,
      performed_at: "2025-06-15 07:45:00",
      is_complete: 1,
    },
    {
      user_id: 2,
      action_id: 6, // Diving
      object_type: "sub_department",
      object_name: "Window",
      comment: "Cleaned algae buildup on viewing windows",
      comment_type: "observation",
      performed_at: "2025-06-15 11:30:00",
      is_complete: 1,
    },
    {
      user_id: 4,
      action_id: 17, // Depolox calibration
      object_type: "sub_department",
      object_name: "Backpool",
      comment: "Calibration required adjustment",
      comment_type: "error",
      performed_at: "2025-06-15 13:15:00",
      is_complete: 1,
    },
    {
      user_id: 1,
      action_id: 4, // Fill Locron day tank
      object_type: "sub_department",
      object_name: "House",
      comment: "",
      comment_type: null,
      performed_at: "2025-06-15 15:00:00",
      is_complete: 1,
    },
    {
      user_id: 3,
      action_id: 1, // Check pre-filters pumps
      object_type: "pump",
      object_name: "PAQ1",
      comment: "Slight vibration detected",
      comment_type: "error",
      performed_at: "2025-06-15 17:20:00",
      is_complete: 1,
    },
  ]);
};

export { seed };
