import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../../middleware/validation/API/helpers/NotificationService.js";

export const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const notifications = await getAllNotifications(limit);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving notifications.",
      error: error.message,
    });
  }
};

export const getUnreadCountHandler = async (req, res) => {
  try {
    const count = await getUnreadCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving unread count.",
      error: error.message,
    });
  }
};

export const markAsReadHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await markAsRead(id);
    res.json({
      message: "Notification marked as read.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem marking notification as read.",
      error: error.message,
    });
  }
};

export const markAllAsReadHandler = async (req, res) => {
  try {
    await markAllAsRead();
    res.json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem marking all notifications as read.",
      error: error.message,
    });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteNotification(id);

    if (deleted === 0) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem deleting notification.",
      error: error.message,
    });
  }
};
