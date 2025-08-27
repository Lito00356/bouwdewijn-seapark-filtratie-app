import Action from "../models/Action.js";
import TaskLog from "../models/Task_log.js";
import Department from "../models/Department.js";
import SubDepartment from "../models/Sub_department.js";
import Filter from "../models/Filter.js";
import Pump from "../models/Pump.js";

/**
 * Date utility functions for server-side period boundaries
 */
function getBelgiumDate() {
  const now = new Date();
  const belgiumTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Europe/Brussels",
    })
  );
  return belgiumTime;
}

function getStartOfDay() {
  const belgiumDate = getBelgiumDate();
  const startOfDay = new Date(belgiumDate);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

function getEndOfDay() {
  const belgiumDate = getBelgiumDate();
  const endOfDay = new Date(belgiumDate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}

function getStartOfWeek() {
  const belgiumDate = getBelgiumDate();
  const dayOfWeek = belgiumDate.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(belgiumDate);
  startOfWeek.setDate(belgiumDate.getDate() - daysFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

function getEndOfWeek() {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

function getStartOfMonth() {
  const belgiumDate = getBelgiumDate();
  const startOfMonth = new Date(
    belgiumDate.getFullYear(),
    belgiumDate.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  return startOfMonth;
}

function getEndOfMonth() {
  const belgiumDate = getBelgiumDate();
  const year = belgiumDate.getFullYear();
  const month = belgiumDate.getMonth();

  // Get last day of month
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endOfMonth = new Date(year, month, lastDay, 23, 59, 59, 999);
  return endOfMonth;
}

function getPeriodBoundaries(frequency) {
  switch (frequency) {
    case "daily":
      return {
        startDate: getStartOfDay(),
        endDate: getEndOfDay(),
      };
    case "weekly":
      return {
        startDate: getStartOfWeek(),
        endDate: getEndOfWeek(),
      };
    case "monthly":
      return {
        startDate: getStartOfMonth(),
        endDate: getEndOfMonth(),
      };
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
}

async function getSystemsForDepartment(departmentId, objectType) {
  const systems = [];

  switch (objectType) {
    case "department":
      const department = await Department.query().findById(departmentId);
      if (department) systems.push(department);
      break;

    case "sub_department":
      const subDepartments = await SubDepartment.query().where(
        "department_id",
        departmentId
      );
      systems.push(...subDepartments);
      break;
    case "filter":
      const filters = await Filter.query()
        .joinRelated("sub_departments")
        .where("sub_departments.department_id", departmentId);
      systems.push(...filters);
      break;

    case "pump":
      const pumps = await Pump.query()
        .joinRelated("sub_departments")
        .where("sub_departments.department_id", departmentId);
      systems.push(...pumps);
      break;
  }

  return systems;
}

async function isTaskCompletedInPeriod(actionId, systemName, frequency) {
  const { startDate, endDate } = getPeriodBoundaries(frequency);

  const existingLog = await TaskLog.query()
    .where("action_id", actionId)
    .where("object_name", systemName)
    .where("is_complete", 1)
    .where("performed_at", ">=", startDate.toISOString())
    .where("performed_at", "<=", endDate.toISOString())
    .first();

  return !!existingLog;
}

async function isIncompleteTaskAlreadyPosted(actionId, systemName, frequency) {
  const { startDate, endDate } = getPeriodBoundaries(frequency);

  const existingIncompleteLog = await TaskLog.query()
    .where("action_id", actionId)
    .where("object_name", systemName)
    .where("is_complete", 0)
    .where("performed_at", ">=", startDate.toISOString())
    .where("performed_at", "<=", endDate.toISOString())
    .first();

  return !!existingIncompleteLog;
}

export async function postIncompleteTasksForFrequency(frequency) {
  try {
    console.log(`🔄 Processing incomplete ${frequency} tasks...`);

    // Get all active actions for this frequency
    const actions = await Action.query()
      .where("frequency", frequency)
      .where("is_active", 1);

    if (actions.length === 0) {
      console.log(`No active ${frequency} actions found`);
      return;
    }

    // Get all departments
    const departments = await Department.query();

    let totalPosted = 0;

    for (const action of actions) {
      console.log(`Processing action: ${action.name} (${action.object_type})`);

      for (const department of departments) {
        // Get all systems for this department and object type
        const systems = await getSystemsForDepartment(
          department.id,
          action.object_type
        );

        for (const system of systems) {
          // Check if task is already completed in this period
          const isCompleted = await isTaskCompletedInPeriod(
            action.id,
            system.name,
            frequency
          );

          if (!isCompleted) {
            // Check if incomplete task was already posted
            const alreadyPosted = await isIncompleteTaskAlreadyPosted(
              action.id,
              system.name,
              frequency
            );

            if (!alreadyPosted) {
              // Post incomplete task
              await TaskLog.query().insert({
                user_id: 1, // System user ID - you might want to create a dedicated system user
                action_id: action.id,
                object_type: action.object_type,
                object_name: system.name,
                comment: "",
                comment_type: "other",
                performed_at: new Date().toISOString(),
                is_complete: 0,
              });

              totalPosted++;
              console.log(
                `✅ Posted incomplete task: ${action.name} for ${system.name}`
              );
            } else {
              console.log(
                `⏭️ Incomplete task already posted: ${action.name} for ${system.name}`
              );
            }
          } else {
            console.log(
              `✅ Task already completed: ${action.name} for ${system.name}`
            );
          }
        }
      }
    }

    console.log(`📊 Posted ${totalPosted} incomplete ${frequency} tasks`);
  } catch (error) {
    console.error(`❌ Error posting incomplete ${frequency} tasks:`, error);
  }
}
