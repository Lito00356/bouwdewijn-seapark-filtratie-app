import { initCrew } from "./crew.js";
import { initModals } from "./utils/ui/modal.js";
import { initNotificationsPolling, initNotificationsList } from "./utils/ui/notifications.js";

document.addEventListener("DOMContentLoaded", async () => {
  initModals(); // Initialize modal system first
  await initCrew();
  initNotificationsList();
  initNotificationsPolling();
});

import "./notificationsWindow.js";
import "./history.js";
import "./crew.js";
import "./adminDepartments.js";
import "./adminSubdepartments.js";
import "./adminActions.js";
import "./adminValues.js";
import "./adminStatistics.js"
