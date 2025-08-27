import { submitTaskLogs } from "../services/taskSubmissionService.js";
import {
  showNotification,
  updateNotificationCount,
  updateNotificationsList,
} from "../utils/ui/notifications.js";
import {
  collectTaskFormData,
  createTaskLogEntries,
} from "../utils/tasks/taskUtils.js";
import { getAvailableItemsFromDropdown } from "../utils/tasks/taskUtils.js";
import { handleTaskSubmissionSuccessWithUI } from "../utils/tasks/taskCompletionUI.js";
import { getPeriodText } from "../utils/tasks/taskUtils.js";
import { validateComment } from "../utils/commentValidation.js";

export function filterCompletedSystems(taskLogEntries, actionId) {
  if (!window.taskCompletionData || !window.taskCompletionData.actions) {
    return { validEntries: taskLogEntries, skippedSystems: [] };
  }

  const action = window.taskCompletionData.actions.find(
    (a) => a.id === actionId
  );
  if (!action) {
    return { validEntries: taskLogEntries, skippedSystems: [] };
  }

  const lastCompletionStatus = window.lastCompletionStatus;
  if (!lastCompletionStatus || !lastCompletionStatus[actionId]) {
    return { validEntries: taskLogEntries, skippedSystems: [] };
  }

  const actionStatus = lastCompletionStatus[actionId];
  const validEntries = [];
  const skippedSystems = [];

  for (const entry of taskLogEntries) {
    const systemName = entry.object_name;
    const systemStatus = actionStatus.systems[systemName];
    const isCompleted = systemStatus && systemStatus.isCompleted;

    if (isCompleted) {
      skippedSystems.push(systemName);

      const canRepeat = action.frequency === "as_needed";
      if (canRepeat) {
        validEntries.push(entry);
      }
    } else {
      validEntries.push(entry);
    }
  }

  return { validEntries, skippedSystems };
}

async function processTaskSubmission(
  form,
  modal,
  actionId,
  objectType,
  availableItems
) {
  try {
    const taskData = collectTaskFormData(form, actionId, objectType);

    // Validate comment type if comment is provided
    if (!validateComment(taskData)) {
      return;
    }

    const allTaskLogEntries = createTaskLogEntries(taskData, availableItems);

    const { validEntries, skippedSystems } = filterCompletedSystems(
      allTaskLogEntries,
      actionId
    );

    if (validEntries.length === 0) {
      const action = window.taskCompletionData?.actions?.find(
        (a) => a.id === actionId
      );
      const frequency = action?.frequency || "period";
      const periodText = getPeriodText(frequency);

      const totalSelected = allTaskLogEntries.length;
      const errorMessage =
        totalSelected === 1
          ? `This system has already completed this task for ${periodText}`
          : `All selected systems have already completed this task for ${periodText}`;

      throw new Error(errorMessage);
    }
    await submitTaskLogs(validEntries);
    const hasComments = validEntries.some(
      (entry) => entry.comment && entry.comment.trim() !== ""
    );
    if (hasComments) {
      await updateNotificationCount();
      await updateNotificationsList();
    }

    modal.close();
    form.reset();

    let message;
    if (skippedSystems.length === 0) {
      message =
        validEntries.length === 1
          ? "Task completed successfully!"
          : `Task completed for ${validEntries.length} systems!`;
    } else {
      message = `Task completed for ${validEntries.length} systems!`;
    }
    showNotification(message, "success");

    // Update notification count immediately after submission
    updateNotificationCount();

    if (window.taskCompletionData) {
      await handleTaskSubmissionSuccessWithUI();
    }
  } catch (error) {
    console.error("❌ Task submission failed:", error);
    showNotification(`${error.message}`, "error");
  }
}

function createFormSubmitHandler(form, modal, actionId, objectType) {
  return async function onFormSubmit(e) {
    e.preventDefault();

    const availableItems = getAvailableItemsFromDropdown(form);

    await processTaskSubmission(
      form,
      modal,
      actionId,
      objectType,
      availableItems
    );
  };
}

export function initTaskSubmission() {
  const $taskForms = document.querySelectorAll("form[data-task-form]");

  $taskForms.forEach((form) => {
    const $modal = form.closest("dialog");
    const $submitButton = form.querySelector("button[data-task-submit]");

    if (!$modal || !$submitButton) {
      console.warn("Task form missing modal or submit button:", form);
      return;
    }

    // Get task configuration from form attributes
    const actionId = parseInt(form.getAttribute("data-action-id"));
    const objectType = form.getAttribute("data-object-type");

    // Create and attach submit handler
    const submitHandler = createFormSubmitHandler(
      form,
      $modal,
      actionId,
      objectType
    );
    $submitButton.addEventListener("click", submitHandler);
  });
}
