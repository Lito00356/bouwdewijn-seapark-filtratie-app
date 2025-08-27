import {
  showNotification,
} from "../utils/ui/notifications.js";

export async function markNotificationAsRead(notificationId) {
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    showNotification("Notification marked as read", "success");
    return await response.json();
  } catch (error) {
    console.error("Error marking notification as read:", error);
    showNotification("Error marking notification as read", "error");
    throw error;
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const response = await fetch("/api/notifications/mark-all-read", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    showNotification("All notifications marked as read", "success");
    return await response.json();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    showNotification("Error marking all notifications as read", "error");
    throw error;
  }
}