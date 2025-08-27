import { clearDropdownOptions } from "../../render/subdepartmentDropdownRenderer.js";
import { formatSubdepartmentName } from "../systems/subdepartmentUtils.js";
import { getItemsByObjectType } from "../domUtils.js";

export function updateTaskModalSelects(
  departmentSubdepartments,
  departmentFilters,
  departmentPumps
) {
  const $taskForms = document.querySelectorAll("form[data-task-form]");

  $taskForms.forEach((form) => {
    const $systemChoiceDropdown = form.querySelector(
      '[data-select="system-choice"]'
    );

    if (!$systemChoiceDropdown) return;

    const objectType = form.getAttribute("data-object-type");
    if (!objectType) return;

    clearDropdownOptions($systemChoiceDropdown);
    const $allOption = document.createElement("option");
    $allOption.value = "all";
    $allOption.textContent = "All";
    $systemChoiceDropdown.appendChild($allOption);

    const items = getItemsByObjectType(
      objectType,
      departmentSubdepartments,
      departmentFilters,
      departmentPumps
    );

    items.forEach((item) => {
      const $option = document.createElement("option");
      $option.value = item.id;

      const displayName =
        objectType === "sub_department"
          ? formatSubdepartmentName(item.name)
          : item.name;

      $option.textContent = displayName;

      $option.setAttribute("data-original-name", item.name);

      $systemChoiceDropdown.appendChild($option);
    });
  });
}
