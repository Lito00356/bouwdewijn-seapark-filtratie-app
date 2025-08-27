import { updateFormDepartmentId } from "../utils/systems/departmentSync.js";
import { getSubdepartmentsByDepartment, getItemsByDepartment } from "../utils/systems/departmentUtils.js";
import { updateSubdepartmentDropdown } from "../render/subdepartmentDropdownRenderer.js";
import { setFormSubdepartmentIdToFirst } from "../utils/systems/subdepartmentSync.js";
import { updateTaskModalSelects } from "../utils/tasks/taskModalUpdater.js";
import { renderSystemList } from "../render/systemListRenderer.js";
import { refreshTaskCompletionStatusWithUI, clearAllCompletionIndicators } from "../utils/tasks/taskCompletionUI.js";
import { validateTaskCompletionData } from "../utils/tasks/taskCompletionUtils.js";

export async function handleDepartmentChange(event, form, subdepartmentSelect, allSubdepartments, allFilters, allPumps) {
  const $tasksContainers = document.querySelectorAll("[data-container='employee-tasks']");
  const newDepartmentId = parseInt(event.target.value);

  updateFormDepartmentId(form, newDepartmentId);

  const filteredSubdepartments = getSubdepartmentsByDepartment(allSubdepartments, newDepartmentId);

  if (subdepartmentSelect) {
    updateSubdepartmentDropdown(subdepartmentSelect, filteredSubdepartments);
    setFormSubdepartmentIdToFirst(filteredSubdepartments);
  }

  if ($tasksContainers.length > 0) {
    const filteredFilters = getItemsByDepartment(allFilters, allSubdepartments, newDepartmentId);
    const filteredPumps = getItemsByDepartment(allPumps, allSubdepartments, newDepartmentId);
    updateTaskModalSelects(filteredSubdepartments, filteredFilters, filteredPumps);
    renderSystemList(filteredSubdepartments, filteredFilters, filteredPumps); // Update task completion status - API will provide correct systems data
    const { isValid } = validateTaskCompletionData();
    if (isValid) {
      try {
        clearAllCompletionIndicators();
        await refreshTaskCompletionStatusWithUI(newDepartmentId, null);
      } catch (error) {
        console.error("❌ Error refreshing task completion in department change:", error);
      }
    }
  }
}
