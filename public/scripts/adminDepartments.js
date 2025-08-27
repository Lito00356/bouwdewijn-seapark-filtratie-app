import { handleDropdownClick } from "./utils/dropdown.js";
import { createEntityActionHandler } from "./utils/entityActions.js";
import { handleGenericFormSubmit } from "./utils/entityOperations.js";

function getDepartmentDataFromDOM(element) {
  const departmentBlock = element.closest("[data-department-id]");

  if (!departmentBlock) {
    throw new Error("Department data not found in DOM");
  }

  return {
    id: departmentBlock.dataset.departmentId,
    name: departmentBlock.dataset.departmentName,
    is_active: departmentBlock.dataset.departmentActive,
  };
}

function populateEditModal(departmentData) {
  const nameInput = document.getElementById("departmentName");
  const activeSelect = document.getElementById("departmentActive");
  const modal = document.querySelector('[data-modal="edit-department"]');

  nameInput.value = departmentData.name || "";
  activeSelect.value = departmentData.is_active;
  modal.dataset.departmentId = departmentData.id;
}

const handleDepartmentActions = createEntityActionHandler({
  entityName: 'department',
  getDataFromDOM: getDepartmentDataFromDOM,
  populateEditModal: populateEditModal
});

function initializeEventListeners() {
  document.addEventListener("click", handleDropdownClick);
  document.addEventListener("click", handleDepartmentActions);

  const editForm = document.getElementById("editDepartmentForm");
  const addForm = document.getElementById("addDepartmentForm");
  if (editForm) {
    editForm.addEventListener("submit",(e) => handleGenericFormSubmit(e,"department", "edit")
);
  }

  if (addForm) {
    addForm.addEventListener("submit",(e) => handleGenericFormSubmit(e,"department", "add")
);
  }
}

initializeEventListeners();
