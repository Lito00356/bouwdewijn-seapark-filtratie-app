import { getCurrentDepartmentId } from "../domUtils.js";

export function collectTaskFormData(form, actionId, objectType) {
  const formData = new FormData(form);
  const objectIdValue = formData.get("object_id");
  const comment = formData.get("notes") || "";
  const commentType = formData.get("comment_type") || "";

  if (objectIdValue === "all") {
    return {
      isAllOption: true,
      comment,
      commentType,
      actionId,
      objectType,
    };
  } else {
    return {
      isAllOption: false,
      objectId: parseInt(objectIdValue),
      comment,
      commentType,
      actionId,
      objectType,
    };
  }
}

export function createTaskLogEntries(taskData, availableItems = []) {
  const { actionId, objectType, comment, commentType, isAllOption, objectId } =
    taskData;

  if (objectType === "department") {
    if (availableItems.length > 0) {
      return [
        {
          action_id: actionId,
          object_type: objectType,
          object_name: availableItems[0].name,
          comment: comment,
          comment_type: commentType,
          is_complete: 1,
        },
      ];
    }
    return [];
  }
  if (isAllOption) {
    return availableItems.map((item) => ({
      action_id: actionId,
      object_type: objectType,
      object_name: item.name,
      comment: comment,
      comment_type: commentType,
      is_complete: 1,
    }));
  } else {
    const selectedItem = availableItems.find((item) => item.id === objectId);
    return [
      {
        action_id: actionId,
        object_type: objectType,
        object_name: selectedItem?.name || `${objectType}_${objectId}`,
        comment: comment,
        comment_type: commentType,
        is_complete: 1,
      },
    ];
  }
}

export function getAvailableItemsFromDropdown(form) {
  const objectType = form.getAttribute("data-object-type");

  if (objectType === "department") {
    const $departmentSelect = document.querySelector(
      "[data-department-selector]"
    );
    if ($departmentSelect) {
      const selectedOption =
        $departmentSelect.options[$departmentSelect.selectedIndex];
      if (selectedOption) {
        const departmentId = getCurrentDepartmentId();

        return [
          {
            id: departmentId,
            name: selectedOption.textContent.trim(),
          },
        ];
      }
    }
    return [];
  }

  const dropdown = form.querySelector('select[name="object_id"]');
  if (!dropdown) return [];

  const options = Array.from(dropdown.options).filter(
    (option) => option.value !== "all"
  );
  return options.map((option) => ({
    id: parseInt(option.value),
    name:
      option.getAttribute("data-original-name") || option.textContent.trim(),
  }));
}

export function getPeriodText(frequency) {
  switch (frequency) {
    case "daily":
      return "today";
    case "weekly":
      return "this week";
    case "monthly":
      return "this month";
    default:
      return "this period";
  }
}
