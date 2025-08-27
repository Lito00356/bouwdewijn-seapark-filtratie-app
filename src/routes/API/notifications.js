import { Router } from "express";
import {
  index,
  markAsReadHandler,
  markAllAsReadHandler,
  destroy,
  getUnreadCountHandler,
} from "../../controllers/API/NotificationController.js";

const router = Router();

router.get("/", index);
router.get("/unread-count", getUnreadCountHandler);
router.patch("/:id/read", markAsReadHandler);
router.patch("/mark-all-read", markAllAsReadHandler);
router.delete("/:id", destroy);

export default router;
