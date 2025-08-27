import { handleDropdownClick } from "./utils/dropdown.js";
import { handleGenericFormSubmit } from "./utils/entityOperations.js";
import { createEntityActionHandler } from "./utils/entityActions.js";

function getSubdepartmentDataFromDOM(element) {
  const subdepartmentBlock = element.closest("[data-subdepartment-id]");

  if (!subdepartmentBlock) {
    throw new Error("Subdepartment data not found in DOM");
  }

  return {
    id: subdepartmentBlock.dataset.subdepartmentId,
    department_id: subdepartmentBlock.dataset.departmentId,
    name: subdepartmentBlock.dataset.subdepartmentName,
    is_active: subdepartmentBlock.dataset.subdepartmentActive,
  };
}

function populateEditModal(subdepartmentData) {
  const nameInput = document.getElementById("subdepartmentName");
  const activeSelect = document.getElementById("subdepartmentActive");
  const departmentIdInput = document.getElementById(
    "subdepartmentDepartmentId"
  );
  const modal = document.querySelector('[data-modal="edit-sub_department"]');

  nameInput.value = subdepartmentData.name || "";
  activeSelect.value = subdepartmentData.is_active;
  departmentIdInput.value = subdepartmentData.department_id;
  modal.dataset.sub_departmentId = subdepartmentData.id;
}

const handleSubdepartmentActions = createEntityActionHandler({
  entityName: "sub_department",
  getDataFromDOM: getSubdepartmentDataFromDOM,
  populateEditModal: populateEditModal,
});

function initializeEventListeners() {
  document.addEventListener("click", handleDropdownClick);
  document.addEventListener("click", handleSubdepartmentActions);

  const editForm = document.getElementById("editSub_departmentForm");
  const addForm = document.getElementById("addSub_departmentForm");
  if (editForm) {
    editForm.addEventListener("submit", (e) =>
      handleGenericFormSubmit(e, "sub_department", "edit")
    );
  }

  if (addForm) {
    addForm.addEventListener("submit", (e) =>
      handleGenericFormSubmit(e, "sub_department", "add")
    );
  }
}

initializeEventListeners()
