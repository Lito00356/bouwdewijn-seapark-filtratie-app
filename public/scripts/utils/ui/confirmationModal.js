import { openModal } from "./modal.js";
import { showNotification } from "./notifications.js";
import {
  resetAllInputStyling,
  validateAndConvertToNumbers,
} from "../numberValidation.js";
import { collectMeasurementData } from "../measurementUtils.js";
import { displayConfirmationModalData } from "../../render/confirmationModalRenderer.js";
import { validateComment } from "../commentValidation.js";

function handleConfirmationModal(form) {
  const $submitButton = form.querySelector("[data-validate]");

  if (!$submitButton) {
    console.error("Submit button with data-validate not found");
    return;
  }

  $submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const isValid = validateAndConvertToNumbers(form);

    if (!isValid) {
      return;
    }
    const measurementData = collectMeasurementData(form);
    if (
      !measurementData.measurements ||
      measurementData.measurements.length === 0
    ) {
      showNotification("No values entered.", "error");
      resetAllInputStyling(form);
      return;
    }

    if (!validateComment(measurementData)) {
      resetAllInputStyling(form);
      return;
    }

    displayConfirmationModalData(measurementData);
    resetAllInputStyling(form);
    openModal("validation-dialog");
  });
}

export function initConfirmationModal() {
  const $form = document.querySelector("form[data-measurement-form]");
  if (!$form) {
    return;
  }

  handleConfirmationModal($form);
}
