import { initMobileNavToggle } from "./utils/ui/navigation.js";
import { initModals } from "./utils/ui/modal.js";
import { initConvertCommaToDot } from "./utils/convertCommaToDot.js";
import { initFormNumberValidation } from "./utils/numberValidation.js";
import { initSubdepartmentSync } from "./utils/systems/subdepartmentSync.js";
import { initConfirmationModal } from "./utils/ui/confirmationModal.js";
import { initMeasurementSubmit } from "./handlers/measurementSubmissionHandler.js";
import { initRealTimeChlorineCalculation } from "./utils/measurementUtils.js";
import { initDepartmentSync } from "./utils/systems/departmentSync.js";
import { initTaskSubmission } from "./handlers/taskSubmissionHandler.js";
import { initTaskUncheck } from "./handlers/taskUncheckHandler.js";
import { initTaskCompletionIfNeeded } from "./utils/tasks/taskCompletion.js";
import {
  initNotificationsPolling,
  initNotificationsList,
} from "./utils/ui/notifications.js";

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavToggle();
  initModals();
  initConvertCommaToDot();
  initFormNumberValidation();
  initSubdepartmentSync();
  initDepartmentSync();
  initTaskSubmission();
  initTaskUncheck();
  initConfirmationModal();
  initMeasurementSubmit();
  initRealTimeChlorineCalculation();
  initTaskCompletionIfNeeded();
  initNotificationsList();
  initNotificationsPolling();
});
