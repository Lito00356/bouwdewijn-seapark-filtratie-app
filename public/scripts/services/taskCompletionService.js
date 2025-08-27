import {
  getPeriodBoundaries,
  formatForDatabase,
  parseBackendDate,
} from "../utils/dateUtils.js";
import { fetchData } from "./fetch.js";

export async function fetchRecentTaskLogs(departmentId) {
  try {
    // Calculate date range (35 days ago to now)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 35);

    const queryParams = new URLSearchParams({
      department_id: departmentId,
      start_date: formatForDatabase(startDate),
      end_date: formatForDatabase(endDate),
      limit: 1000, // Safety limit
    });

    const data = await fetchData(`task_logs/recent?${queryParams}`);
    const { taskLogs, systems, actions } = data;

    // Process the task logs - backend formats dates as "dd/mm/yy hh:mm:ss"
    const processedTaskLogs = taskLogs.map((log) => {
      const performedAtDate = parseBackendDate(log.performed_at);

      return {
        ...log,
        performed_at_date: performedAtDate,
      };
    });
    return { taskLogs: processedTaskLogs, systems, actions };
  } catch (error) {
    console.error("❌ Error fetching recent task logs:", error);
    return { taskLogs: [], systems: null, actions: [] };
  }
}

export function processTaskCompletionStatus(taskLogs, actions, systems) {
  const completionStatus = {};

  if (!systems) {
    console.error("❌ No systems data provided to processTaskCompletionStatus");
    return {};
  }

  // Initialize completion status structure
  actions.forEach((action) => {
    completionStatus[action.id] = {
      actionId: action.id,
      actionName: action.name,
      frequency: action.frequency,
      objectType: action.object_type,
      systems: {},
    };

    // Initialize each system for this action
    const relevantSystems = getRelevantSystems(systems, action.object_type);
    relevantSystems.forEach((system) => {
      completionStatus[action.id].systems[system.name] = {
        systemId: system.id,
        systemName: system.name,
        isCompleted: false,
        completionCount: 0, 
        lastCompletedAt: null,
      };
    });
  });
  // 35days, now filtering
  actions.forEach((action) => {
    const { startDate, endDate } = getPeriodBoundaries(action.frequency);


    // Filter task logs for this action within the specific period
    const relevantLogs = taskLogs.filter((log) => {
      if (log.action_id !== action.id) return false;

      const logDate =
        log.performed_at_date || parseBackendDate(log.performed_at);
      const withinRange = logDate >= startDate && logDate <= endDate;

      return withinRange;
    });

    // Update completion status based on completed logs
    relevantLogs.forEach((log) => {
      const actionStatus = completionStatus[action.id];
      if (actionStatus && actionStatus.systems[log.object_name]) {
        const systemStatus = actionStatus.systems[log.object_name];

        systemStatus.isCompleted = true;

        if (action.frequency === "as_needed") {
          systemStatus.completionCount++;
        }
        const logDate =
          log.performed_at_date || parseBackendDate(log.performed_at);

        if (
          !systemStatus.lastCompletedAt ||
          logDate > parseBackendDate(systemStatus.lastCompletedAt)
        ) {
          systemStatus.lastCompletedAt = log.performed_at;
        }
      } else {
        console.warn(
          `⚠️ System ${log.object_name} not found in completion status for action ${action.id}`
        );
      }
    });
  });

  return completionStatus;
}

function getRelevantSystems(systems, objectType) {
  if (!systems) {
    console.warn(`⚠️ No systems data for object type: ${objectType}`);
    return [];
  }

  switch (objectType) {
    case "sub_department":
      return systems.subdepartments || [];
    case "filter":
      return systems.filters || [];
    case "pump":
      return systems.pumps || [];
    case "department":
      return systems.department ? [systems.department] : [];
    default:
      return [];
  }
}
