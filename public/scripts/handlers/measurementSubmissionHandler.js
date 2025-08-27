import {
  showNotification,
  updateNotificationCount,
  updateNotificationsList,
} from "../utils/ui/notifications.js";
import { collectMeasurementData } from "../utils/measurementUtils.js";
import { submitMeasurementLog } from "../services/measurementSubmissionService.js";

function createMeasurementSubmitHandler($form, $modal) {
  return async function handleSubmit(e) {
    e.preventDefault();
    try {
      const measurementData = collectMeasurementData($form);
      await submitMeasurementLog(measurementData);

      // Update notifications if there are any comments (user or auto-generated)
      const hasComments =
        measurementData.comment && measurementData.comment.trim() !== "";

      if (hasComments) {
        await updateNotificationCount();
        await updateNotificationsList();
      }

      $modal.close();
      $form.reset();
      showNotification("Success!", "success");
    } catch (error) {
      console.error("❌ Submission failed:", error);
      showNotification(`Submission failed: ${error.message}`, "error");
    }
  };
}

export function handleMeasurementSubmit($form) {
  const $modal = document.querySelector('[data-modal="validation-dialog"]');
  const $submitButton = $modal?.querySelector("[data-submit]");

  if (!$modal || !$submitButton) {
    console.error("Confirmation modal or submit button not found");
    return;
  }

  const handleSubmit = createMeasurementSubmitHandler($form, $modal);
  $submitButton.addEventListener("click", handleSubmit);
}

export function initMeasurementSubmit() {
  const $form = document.querySelector("form[data-measurement-form]");
  if (!$form) {
    return;
  }

  handleMeasurementSubmit($form);
}
