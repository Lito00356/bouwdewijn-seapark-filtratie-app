import {
  fetchRecentTaskLogs,
  processTaskCompletionStatus,
} from "../../services/taskCompletionService.js";
import { getCurrentDepartmentId } from "../domUtils.js";

// store last completion status
let lastCompletionStatus = null;

export function validateTaskCompletionData(departmentId = null) {
  const currentDepartmentId = departmentId || getCurrentDepartmentId();

  if (!currentDepartmentId) {
    return { isValid: false, departmentId: null };
  }

  return {
    isValid: true,
    departmentId: currentDepartmentId,
  };
}

function validateApiResponseData(systems, actions) {
  if (!systems) {
    return { isValid: false, error: "No systems data" };
  }

  if (typeof systems !== "object") {
    console.error("❌ Invalid systems data structure:", typeof systems);
    return { isValid: false, error: "Invalid systems data structure" };
  }

  if (!actions || actions.length === 0) {
    console.error("❌ No actions data available from backend");
    return { isValid: false, error: "No actions data" };
  }

  return { isValid: true };
}

export async function getTaskCompletionStatus(departmentId) {
  try {
    const fetchResult = await fetchRecentTaskLogs(departmentId);
    if (!fetchResult) {
      console.error("❌ Failed to fetch task logs");
      return {};
    }

    const { taskLogs, systems, actions } = fetchResult;

    const apiValidation = validateApiResponseData(systems, actions);
    if (!apiValidation.isValid) {
      console.warn(
        "⚠️ API response data validation failed:",
        apiValidation.error
      );
      return {};
    }

    // Update global data with backend data for consistency
    window.taskCompletionData = {
      systems: {
        subdepartments: systems.subdepartments || [],
        filters: systems.filters || [],
        pumps: systems.pumps || [],
        department: systems.department || null,
      },
      actions: actions,
    };

    const completionStatus = processTaskCompletionStatus(
      taskLogs,
      actions,
      systems
    );

    return completionStatus;
  } catch (error) {
    console.error("❌ Error getting task completion status:", error);
    return {};
  }
}

export function hasCompletionStatusChanged(newStatus) {
  if (!lastCompletionStatus) {
    return true;
  }

  const hasChanged =
    JSON.stringify(lastCompletionStatus) !== JSON.stringify(newStatus);

  return hasChanged;
}

export function updateLastCompletionStatus(completionStatus) {
  lastCompletionStatus = JSON.parse(JSON.stringify(completionStatus));
  window.lastCompletionStatus = lastCompletionStatus;
}

export async function refreshTaskCompletionStatus(departmentId = null) {
  try {
    const { isValid, departmentId: validatedDepartmentId } =
      validateTaskCompletionData(departmentId);
    if (!isValid) {
      console.warn("⚠️ Task completion data validation failed");
      return {};
    }

    // Actions and systems are now always fetched from API
    const completionStatus = await getTaskCompletionStatus(
      validatedDepartmentId
    );
    if (!completionStatus) {
      console.warn("⚠️ Failed to get task completion status");
      return {};
    }

    return completionStatus;
  } catch (error) {
    console.error("❌ Error refreshing task completion status:", error);
    return {};
  }
}

export async function initTaskCompletionTracking(departmentId) {
  try {
    const initialStatus = await refreshTaskCompletionStatus(departmentId);

    return initialStatus;
  } catch (error) {
    console.error("❌ Error initializing task completion tracking:", error);
    return {};
  }
}

export async function handleTaskSubmissionSuccess() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  const departmentId = getCurrentDepartmentId();
  const result = await refreshTaskCompletionStatus(departmentId);
  return result;
}
