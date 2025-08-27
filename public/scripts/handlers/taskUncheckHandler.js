import { showNotification } from "../utils/ui/notifications.js";
import {
  collectTaskFormData,
  getAvailableItemsFromDropdown,
  createTaskLogEntries,
  getPeriodText
} from "../utils/tasks/taskUtils.js";
import { handleTaskSubmissionSuccessWithUI } from "../utils/tasks/taskCompletionUI.js";
import { 
  validateTaskDeletionData, 
  createUncheckResultMessage 
} from "../utils/tasks/taskDeletionUtils.js";
import { deleteTaskLogsForSystems } from "../services/taskDeletionService.js";
import { filterCompletedSystems } from "./taskSubmissionHandler.js";


async function processTaskUncheck(
  form,
  modal,
  actionId,
  objectType,
  availableItems
) {
  try {
    const { isValid, departmentId, action } = validateTaskDeletionData(actionId);
    if (!isValid) {
      return;
    }

    const taskData = collectTaskFormData(form, actionId, objectType);
    
    // Create theoretical task log entries to see what systems would be affected
    const theoreticalTaskLogEntries = createTaskLogEntries(
      taskData,
      availableItems
    );
    
    const { skippedSystems } = filterCompletedSystems(
      theoreticalTaskLogEntries,
      actionId
    );

    if (skippedSystems.length === 0) {
      const frequency = action?.frequency || "period";

      if (frequency === "as_needed") {
        showNotification(
          "No completed instances of this task found to uncheck.",
          "error"
        );
      } else {
        const periodText = getPeriodText(frequency);
        const totalSelected = theoreticalTaskLogEntries.length;
        const message =
          totalSelected === 1
            ? `This system has not completed this task ${periodText}`
            : `None of the selected systems have completed this task ${periodText}`;

        showNotification(message, "error");
      }
      return;
    }

    const { successful, failed } = await deleteTaskLogsForSystems(
      skippedSystems,
      actionId,
      departmentId,
      action
    );

    modal.close();
    form.reset();

    const message = createUncheckResultMessage(successful, failed);
    showNotification(message, "success");

    // Refresh the completion status and UI
    if (window.taskCompletionData) {
      await handleTaskSubmissionSuccessWithUI();
    }
  } catch (error) {
    console.error("❌ Task uncheck failed:", error);
    showNotification(`Failed to uncheck task: ${error.message}`, "error");
  }
}

function createUncheckHandler(form, modal, actionId, objectType) {
  return async function onFormUncheck(e) {
    e.preventDefault();

    const availableItems = getAvailableItemsFromDropdown(form);

    await processTaskUncheck(form, modal, actionId, objectType, availableItems);
  };
}

export function initTaskUncheck() {
  const $taskForms = document.querySelectorAll("form[data-task-form]");

  $taskForms.forEach((form) => {
    const $modal = form.closest("dialog");
    const $uncheckButton = form.querySelector("button[data-task-uncheck]");

    if (!$modal || !$uncheckButton) {
      console.warn("Task form missing modal or uncheck button:", form);
      return;
    }

    // Get task configuration from form attributes
    const actionId = parseInt(form.getAttribute("data-action-id"));
    const objectType = form.getAttribute("data-object-type");

    // Create and attach uncheck handler
    const uncheckHandler = createUncheckHandler(
      form,
      $modal,
      actionId,
      objectType
    );
    $uncheckButton.addEventListener("click", uncheckHandler);
  });
}
