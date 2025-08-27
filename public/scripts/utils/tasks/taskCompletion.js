import { initTaskCompletionTrackingWithUI } from "./taskCompletionUI.js";
import { getCurrentDepartmentId } from "../domUtils.js";

export async function initTaskCompletionIfNeeded() {
  const $tasksContainer = document.querySelector(
    '[data-container="employee-tasks"]'
  );
  if (!$tasksContainer) {
    return;
  }
  try {
    const departmentId = getCurrentDepartmentId();

    if (!departmentId) {
      return;
    }
    
    await initTaskCompletionTrackingWithUI(departmentId);
  } catch (error) {
    console.error("Error initializing task completion tracking:", error);
  }
}
