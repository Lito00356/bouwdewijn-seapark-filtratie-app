export function getCurrentDepartmentId() {
  const $form = document.querySelector("form[data-department-id]");
  if ($form) {
    const departmentId = parseInt($form.getAttribute("data-department-id"));
    return isNaN(departmentId) ? null : departmentId;
  }
  return null;
}

export function getCurrentSubDepartmentId() {
  const $form = document.querySelector("form[data-measurement-form]");
  if ($form && $form.dataset.subdepartmentId) {
    return Number($form.dataset.subdepartmentId);
  }

  console.error("❌ No subdepartment ID found - this should not happen");
  return null;
}

export function removeElements(selector) {
  document.querySelectorAll(selector).forEach((element) => element.remove());
}

export function removeClasses(selector, className) {
  document
    .querySelectorAll(selector)
    .forEach((element) => element.classList.remove(className));
}

export function removeAttributes(selector, attributeName) {
  document
    .querySelectorAll(selector)
    .forEach((element) => element.removeAttribute(attributeName));
}

export function getItemsByObjectType(
  objectType,
  departmentSubdepartments,
  departmentFilters,
  departmentPumps
) {
  switch (objectType) {
    case "sub_department":
      return departmentSubdepartments;
    case "filter":
      return departmentFilters;
    case "pump":
      return departmentPumps;
    case "department":
      return [];
    default:
      return [];
  }
}