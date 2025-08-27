import { fetchRecentTaskLogs } from "./taskCompletionService.js";
import { getPeriodBoundaries, parseBackendDate } from "../utils/dateUtils.js";

function findTaskLogsToDelete(
  allRecentLogs,
  systemNames,
  actionId,
  startDate,
  endDate,
  frequency
) {
  const taskLogEntriesToDelete = [];

  for (const systemName of systemNames) {
    const matchingLogs = allRecentLogs.filter((log) => {
      if (log.action_id !== actionId || log.object_name !== systemName) {
        return false;
      }

      // Parse the backend date using utility function
      const logDate = parseBackendDate(log.performed_at);

      // Check if log is within current period
      const withinPeriod = logDate >= startDate && logDate <= endDate;
      return withinPeriod;
    }); 
    // as_needed only delete most recent
    if (frequency === "as_needed" && matchingLogs.length > 0) {
      // Sort
      const sortedLogs = matchingLogs.sort((a, b) => {
        const dateA = parseBackendDate(a.performed_at);
        const dateB = parseBackendDate(b.performed_at);
        return dateB.getTime() - dateA.getTime();
      });
      taskLogEntriesToDelete.push(sortedLogs[0]);
    } else {
      taskLogEntriesToDelete.push(...matchingLogs);
    }
  }

  return taskLogEntriesToDelete;
}

async function deleteTaskLogEntry(entry) {
  const response = await fetch(`/api/task_logs/${entry.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return { entry, result: await response.json() };
}

function processTaskLogDeletionResults(results, taskLogEntriesToDelete) {
  const successful = [];
  const failed = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successful.push(result.value.entry);
    } else {
      failed.push({
        entry: taskLogEntriesToDelete[index],
        error: result.reason.message || result.reason,
      });
    }
  });

  return { successful, failed };
}

export async function deleteTaskLogsForSystems(
  systemNames,
  actionId,
  departmentId,
  action
) {
  try {
    // Get period boundaries
    const { startDate, endDate } = getPeriodBoundaries(action.frequency);
    // Fetch recent task logs
    const fetchResult = await fetchRecentTaskLogs(departmentId);
    const allRecentLogs = fetchResult?.taskLogs || [];

    if (!allRecentLogs || allRecentLogs.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    // Find task log entries to delete
    const taskLogEntriesToDelete = findTaskLogsToDelete(
      allRecentLogs,
      systemNames,
      actionId,
      startDate,
      endDate,
      action.frequency
    );

    if (taskLogEntriesToDelete.length === 0) {
      return { successful: [], failed: [] };
    }

    const deletePromises = taskLogEntriesToDelete.map(deleteTaskLogEntry);
    const results = await Promise.allSettled(deletePromises);

    return processTaskLogDeletionResults(results, taskLogEntriesToDelete);
  } catch (error) {
    console.error("Error deleting task logs:", error);
    return { successful: [], failed: [] };
  }
}
