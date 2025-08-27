import { handleDropdownClick } from "./utils/dropdown.js";
import { createEntityActionHandler } from "./utils/entityActions.js";
import { handleGenericFormSubmit } from "./utils/entityOperations.js";

function getActionDataFromDOM(element) {
  const actionBlock = element.closest("[data-action-id]");

  if (!actionBlock) {
    throw new Error("Action data not found in DOM");
  }

  return {
    id: actionBlock.dataset.actionId,
    name: actionBlock.dataset.actionName,
    object_type: actionBlock.dataset.actionObjectType,
    frequency: actionBlock.dataset.actionFrequency,
    is_active: actionBlock.dataset.actionActive,
  };
}

function populateEditModal(actionData) {
  const nameInput = document.getElementById("actionName");
  const objectTypeSelect = document.getElementById("objectType");
  const frequencySelect = document.getElementById("frequency");
  const activeSelect = document.getElementById("actionActive");
  const modal = document.querySelector('[data-modal="edit-action"]');

  nameInput.value = actionData.name || "";
  objectTypeSelect.value = actionData.object_type || "";
  frequencySelect.value = actionData.frequency || "";
  activeSelect.value = actionData.is_active;
  modal.dataset.actionId = actionData.id;
}

const handleActionActions = createEntityActionHandler({
  entityName: "action",
  getDataFromDOM: getActionDataFromDOM,
  populateEditModal: populateEditModal,
});

function initializeEventListeners() {
  document.addEventListener("click", handleDropdownClick);
  document.addEventListener("click", handleActionActions);

  const editForm = document.getElementById("editActionForm");
  const addForm = document.getElementById("addActionForm");
  if (editForm) {
    editForm.addEventListener("submit", (e) =>
      handleGenericFormSubmit(e, "action", "edit")
    );
  }

  if (addForm) {
    addForm.addEventListener("submit", (e) =>
      handleGenericFormSubmit(e, "action", "add")
    );
  }
}

initializeEventListeners()
