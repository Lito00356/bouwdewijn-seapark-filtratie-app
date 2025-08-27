export function setFormSubdepartmentIdToFirst(filteredSubdepartments) {
  const $measurementForm = document.querySelector("form[data-subdepartment-id]");

  if ($measurementForm && filteredSubdepartments.length > 0) {
    const firstSubdepartmentId = filteredSubdepartments[0].id;
    $measurementForm.dataset.subdepartmentId = firstSubdepartmentId;
  }
}

export function initSubdepartmentSync() {
  const $subdepartmentSelect = document.querySelector("[data-subdepartment-selector]");
  const $form = document.querySelector("[data-subdepartment-id]");

  if (!$subdepartmentSelect || !$form) {
    return;
  }

  $subdepartmentSelect.addEventListener("change", (e) => {
    const newSubdepartmentId = e.target.value;
    $form.dataset.subdepartmentId = newSubdepartmentId;
  });
}
