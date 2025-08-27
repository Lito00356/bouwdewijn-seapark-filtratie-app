export function validateTaskDeletionData(actionId) {
  if (!window.taskCompletionData || !window.taskCompletionData.systems) {
    return { isValid: false, departmentId: null, action: null };
  }

  const departmentId = window.taskCompletionData.systems.department?.id;
  if (!departmentId) {
    console.error("No department ID found");
    return { isValid: false, departmentId: null, action: null };
  }

  const action = window.taskCompletionData.actions.find(
    (a) => a.id === actionId
  );
  if (!action) {
    console.error("Action not found:", actionId);
    return { isValid: false, departmentId, action: null };
  }
  return { isValid: true, departmentId, action };
}

export function createUncheckResultMessage(successful, failed) {
  if (failed.length === 0 && successful.length > 0) {
    return successful.length === 1
      ? "Task unchecked successfully!"
      : `Tasks unchecked for ${successful.length} systems!`;
  } else if (successful.length > 0) {
    return `${successful.length} systems unchecked successfully, ${failed.length} failed.`;
  } else {
    throw new Error("No task log entries were found to delete.");
  }
}
