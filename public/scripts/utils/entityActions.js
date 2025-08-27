import { openModal } from "./ui/modal.js";

export function createEntityActionHandler(entityConfig) {
  const { entityName, getDataFromDOM, populateEditModal } = entityConfig;

  function handleEdit(element) {
    try {
      const entityData = getDataFromDOM(element);
      populateEditModal(entityData);
      openModal(`edit-${entityName}`);
    } catch (error) {
      console.error(`Error getting ${entityName} data:`, error);
    }
  }

  function handleAdd() {
    const addForm = document.getElementById(
      `add${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Form`
    );
    if (addForm) addForm.reset();
    if (entityName === "sub_department") {
      const departmentId = window.location.pathname.split("/")[2];
      const departmentIdInput = document.getElementById(
        "addSubdepartmentDepartmentId"
      );
      if (departmentIdInput) {
        departmentIdInput.value = departmentId;
      }
    }
    openModal(`add-${entityName}`);
  }

  function handleEntityActions(e) {
    const editAction = e.target.closest(`[data-trigger='edit-${entityName}']`);
    const addAction = e.target.closest(`[data-trigger='add-${entityName}']`);

    if (editAction) {
      handleEdit(editAction);
    } else if (addAction) {
      handleAdd();
    }
  }

  return handleEntityActions;
}
