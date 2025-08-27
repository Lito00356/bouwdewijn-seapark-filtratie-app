import { handleDepartmentChange } from "../../handlers/departmentChangeHandler.js";
import { fetchData } from "../../services/fetch.js";

export function updateFormDepartmentId(form, departmentId) {
  form.dataset.departmentId = departmentId;
}

export async function initDepartmentSync() {
  const $departmentSelect = document.querySelector("[data-department-selector]");
  const $subdepartmentSelect = document.querySelector("[data-subdepartment-selector]");
  const $form = document.querySelector("[data-department-id]");
  const $tasksContainer = document.querySelectorAll("[data-container='employee-tasks']");

  if (!$departmentSelect || !$form) {
    return;
  }
  const allSubdepartments = await fetchData("sub_departments");
  let allFilters = null;
  let allPumps = null;
  if ($tasksContainer.length > 0) {
    [allFilters, allPumps] = await Promise.all([fetchData("filters"), fetchData("pumps")]);
  }
  $departmentSelect.addEventListener("change", async (e) => {
    await handleDepartmentChange(e, $form, $subdepartmentSelect, allSubdepartments, allFilters, allPumps);
  });
}
