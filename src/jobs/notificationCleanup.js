import cron from "node-cron";
import { cleanupOldNotifications } from "../middleware/validation/API/helpers/NotificationService.js";

cron.schedule("0 2 * * *", async () => {
  try {
    await cleanupOldNotifications();
  } catch (error) {
    console.error("❌ Notification cleanup failed:", error);
  }
});

export default cron;
