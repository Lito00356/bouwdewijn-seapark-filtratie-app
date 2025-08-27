import cron from "node-cron";
import { postIncompleteTasksForFrequency } from "../utils/incompleteTaskUtils.js";

cron.schedule("55 23 * * *", async () => {
  await postIncompleteTasksForFrequency("daily");
});

cron.schedule("55 23 * * 0", async () => {
  await postIncompleteTasksForFrequency("weekly");
});

cron.schedule("55 23 28-31 * *", async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (tomorrow.getDate() === 1) {
    await postIncompleteTasksForFrequency("monthly");
  }
});
