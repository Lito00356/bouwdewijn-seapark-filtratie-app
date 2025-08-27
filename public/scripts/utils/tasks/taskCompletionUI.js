import {
  refreshTaskCompletionStatus,
  initTaskCompletionTracking,
  handleTaskSubmissionSuccess,
  hasCompletionStatusChanged,
  updateLastCompletionStatus,
} from "./taskCompletionUtils.js";
import {
  removeAttributes,
  removeElements,
  removeClasses,
} from "../domUtils.js";

export function clearAllCompletionIndicators() {
  removeAttributes("[data-completion-status]", "data-completion-status");
  removeElements(".task-completion-badge, .completion-count-badge");
  removeElements(".task-completion-indicator");
  removeClasses(".task-completed", "task-completed");
  removeClasses(".task-fully-completed", "task-fully-completed");
  removeClasses(".task-partially-completed", "task-partially-completed");
  removeClasses("button[data-task-submit].hidden", "hidden");
  removeClasses("button[data-task-uncheck].hidden", "hidden");

  document.querySelectorAll("button[data-task-submit]").forEach((button) => {
    const $buttonContainer = button.closest(".grid");
    if ($buttonContainer) {
      $buttonContainer.classList.add("grid--2");
    }
  });
}

export function updateTaskUI(completionStatus) {
  Object.values(completionStatus).forEach((actionStatus) => {
    updateTaskButtonForAction(actionStatus);
  });
}

function updateTaskButtonForAction(actionStatus) {
  const { actionId } = actionStatus;
  const $taskButton = document.querySelector(
    `button[data-trigger="modal-task-${actionId}"]`
  );

  if (!$taskButton) {
    console.warn(`Task button not found for action ${actionId}`);
    return;
  }

  const $systemList = $taskButton.querySelector(
    '[data-container="system-list"]'
  );
  if (!$systemList) {
    console.warn(`System list not found for action ${actionId}`);
    return;
  }

  updateSystemListItems($systemList, actionStatus);
  updateTaskAppearance($taskButton, actionStatus);
  UpdateTaskModalButtons(actionStatus);
}

function updateSystemListItems($systemList, actionStatus) {
  const { frequency, systems } = actionStatus;

  const $listItems = $systemList.querySelectorAll("li");

  $listItems.forEach(($item) => {
    const systemName = $item.textContent.trim();
    const systemData = systems[systemName];

    if (systemData) {
      updateSystemListItem($item, systemData, frequency);
    }
  });
}

function updateSystemListItem($item, systemData, frequency) {
  const { isCompleted, completionCount } = systemData;
  $item.classList.remove("task-completed");

  const existingBadge = $item.querySelector(".completion-count-badge");
  if (existingBadge) {
    existingBadge.remove();
  }
  if (isCompleted) {
    if (frequency === "as_needed") {
      if (completionCount > 0) {
        const $badge = document.createElement("span");
        $badge.className = "completion-count-badge";
        $badge.textContent = completionCount;
        $item.appendChild($badge);
      }
    } else {
      $item.classList.add("task-completed");
    }
  }
}

function updateTaskAppearance($taskButton, actionStatus) {
  const systemsArray = Object.values(actionStatus.systems);
  const completedCount = systemsArray.filter((s) => s.isCompleted).length;
  const totalCount = systemsArray.length;

  $taskButton.classList.remove(
    "task-fully-completed",
    "task-partially-completed"
  );

  if (completedCount === totalCount && totalCount > 0) {
    $taskButton.classList.add("task-fully-completed");
  } else if (completedCount > 0 && completedCount < totalCount) {
    $taskButton.classList.add("task-partially-completed");
  }

  if (actionStatus.frequency !== "as_needed") {
    addCompletionIndicator($taskButton, completedCount, totalCount);
  }
}

function UpdateTaskModalButtons(actionStatus) {
  const { actionId, frequency, systems } = actionStatus;

  const $modal = document.querySelector(
    `dialog[data-modal="modal-task-${actionId}"]`
  );
  if (!$modal) {
    return;
  }

  const $submitButton = $modal.querySelector("button[data-task-submit]");
  const $uncheckButton = $modal.querySelector("button[data-task-uncheck]");
  const $buttonContainer = $submitButton?.closest(".grid");

  if (!$submitButton || !$uncheckButton || !$buttonContainer) {
    return;
  }

  const systemsArray = Object.values(systems);
  const completedCount = systemsArray.filter((s) => s.isCompleted).length;
  const totalCount = systemsArray.length;
  const isFullyCompleted = completedCount === totalCount && totalCount > 0;
  const hasCompletedTasks = completedCount > 0;

  const showUncheckButton = hasCompletedTasks;
  const showSubmitButton = frequency === "as_needed" || !isFullyCompleted;
  const showBothButtons = showUncheckButton && showSubmitButton;

  $uncheckButton.classList.toggle("hidden", !showUncheckButton);
  $submitButton.classList.toggle("hidden", !showSubmitButton);
  $buttonContainer.classList.toggle("grid--2", showBothButtons);
}

function addCompletionIndicator($taskButton, completedCount, totalCount) {
  const existingIndicator = $taskButton.querySelector(
    ".task-completion-indicator"
  );
  if (existingIndicator) {
    existingIndicator.remove();
  }

  if (totalCount === 0) return;

  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  if (completionPercentage > 0) {
    const $indicator = document.createElement("div");
    $indicator.className = "task-completion-indicator";
    $indicator.textContent = `${completedCount}/${totalCount}`;

    if (completionPercentage === 100) {
      $indicator.classList.add("completed");
    } else {
      $indicator.classList.add("partial");
    }
    $taskButton.appendChild($indicator);
  }
}

let uiTrackingIntervalId = null;

export async function refreshTaskCompletionStatusWithUI(
  departmentId = null,
  actions = null
) {
  const completionStatus = await refreshTaskCompletionStatus(
    departmentId,
    actions
  );
  if (completionStatus && hasCompletionStatusChanged(completionStatus)) {
    clearAllCompletionIndicators();
    updateTaskUI(completionStatus);
    updateLastCompletionStatus(completionStatus);
  }
}

export async function initTaskCompletionTrackingWithUI(departmentId) {
  try {
    if (uiTrackingIntervalId) {
      clearInterval(uiTrackingIntervalId);
    }

    // Initialize utility tracking (actions and systems will be fetched from API)
    const initialStatus = await initTaskCompletionTracking(departmentId);

    // Update UI with initial status
    if (initialStatus && hasCompletionStatusChanged(initialStatus)) {
      clearAllCompletionIndicators();
      updateTaskUI(initialStatus);
      updateLastCompletionStatus(initialStatus);
    }

    uiTrackingIntervalId = setInterval(async () => {
      await refreshTaskCompletionStatusWithUI();
    }, 30000);
  } catch (error) {
    console.error(
      "❌ Error initializing task completion tracking with UI:",
      error
    );
  }
}

export async function handleTaskSubmissionSuccessWithUI() {

  const completionStatus = await handleTaskSubmissionSuccess();

  if (completionStatus && hasCompletionStatusChanged(completionStatus)) {
    clearAllCompletionIndicators();
    updateTaskUI(completionStatus);
    updateLastCompletionStatus(completionStatus);
  }
}
