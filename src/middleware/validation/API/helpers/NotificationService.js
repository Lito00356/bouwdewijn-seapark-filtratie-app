import Notification from "../../../../models/Notification.js";

export const createTaskCommentNotification = async (taskData) => {
  // Title shows system name and action name (date comes from created_at)
  const title = `${taskData.system_name || "System"} - ${taskData.action_name}`;
  // Message is the actual comment content
  const message = taskData.comment;

  return await Notification.query().insert({
    title,
    message,
    comment_type: taskData.comment_type,
  });
};

export const createMeasurementCommentNotification = async (measurementData) => {
  // Title shows "Measurement Subdepartment" (date comes from created_at)
  const title = `Measurement ${measurementData.sub_department_name}`;
  // Message is the actual comment content
  const message = measurementData.comment;

  return await Notification.query().insert({
    title,
    message,
    comment_type: measurementData.comment_type,
  });
};

export const createSystemNotification = async (
  title,
  message,
  commentType = null
) => {
  return await Notification.query().insert({
    title,
    message,
    comment_type: commentType,
  });
};

// Get all notifications (global)
export const getAllNotifications = async (limit = 50) => {
  return await Notification.query().orderBy("created_at", "desc").limit(limit);
};

// Mark notification as read (global)
export const markAsRead = async (notificationId) => {
  return await Notification.query()
    .where("id", notificationId)
    .patch({ is_read: true, updated_at: new Date().toISOString() });
};

// Mark all notifications as read (global)
export const markAllAsRead = async () => {
  return await Notification.query()
    .where("is_read", false)
    .patch({ is_read: true, updated_at: new Date().toISOString() });
};

// Delete notification (global)
export const deleteNotification = async (notificationId) => {
  return await Notification.query().where("id", notificationId).delete();
};

export const cleanupOldNotifications = async () => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  return await Notification.query()
    .where("created_at", "<", twoWeeksAgo.toISOString())
    .delete();
};

// Get unread count (global)
export const getUnreadCount = async () => {
  const result = await Notification.query()
    .where("is_read", false)
    .count("* as count");

  return result[0]?.count || 0;
};
