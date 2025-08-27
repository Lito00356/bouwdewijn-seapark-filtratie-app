import { handleDropdownClick } from "./utils/dropdown.js";
import { createEntityActionHandler } from "./utils/entityActions.js";
import { handleGenericFormSubmit } from "./utils/entityOperations.js";

function getMeasurementDataFromDOM(element) {
  const measurementBlock = element.closest("[data-measurement-definition-id]");

  if (!measurementBlock) {
    throw new Error("Measurement data not found in DOM");
  }

  return {
    id: measurementBlock.dataset.measurementDefinitionId,
    name: measurementBlock.dataset.measurementName,
    short_name: measurementBlock.dataset.measurementShortName,
    unit: measurementBlock.dataset.measurementUnit,
    min_value: measurementBlock.dataset.measurementMin,
    max_value: measurementBlock.dataset.measurementMax,
    is_active: measurementBlock.dataset.measurementActive,
  };
}

function populateEditModal(measurementData) {
  const nameInput = document.getElementById("valueName");
  const shortNameInput = document.getElementById("shortName");
  const unitInput = document.getElementById("unit");
  const minValueInput = document.getElementById("minValue");
  const maxValueInput = document.getElementById("maxValue");
  const activeSelect = document.getElementById("valueActive");
  const modal = document.querySelector(
    '[data-modal="edit-measurement_definition"]'
  );

  nameInput.value = measurementData.name || "";
  shortNameInput.value = measurementData.short_name || "";
  unitInput.value = measurementData.unit || "";
  minValueInput.value = measurementData.min_value || "";
  maxValueInput.value = measurementData.max_value || "";
  activeSelect.value = measurementData.is_active;
  modal.dataset.measurement_definitionId = measurementData.id;
}

const handleMeasurementActions = createEntityActionHandler({
  entityName: "measurement_definition",
  getDataFromDOM: getMeasurementDataFromDOM,
  populateEditModal: populateEditModal,
});

function initializeEventListeners() {
  document.addEventListener("click", handleDropdownClick);
  document.addEventListener("click", handleMeasurementActions);

  const editForm = document.getElementById("editValueForm");
  const addForm = document.getElementById("addValueForm");

  if (editForm) {
    editForm.addEventListener("submit", (e) =>
      handleGenericFormSubmit(e, "measurement_definition", "edit")
    );
  }

  if (addForm) {
    addForm.addEventListener("submit", (e) =>
      handleGenericFormSubmit(e, "measurement_definition", "add")
    );
  }
}

initializeEventListeners()
