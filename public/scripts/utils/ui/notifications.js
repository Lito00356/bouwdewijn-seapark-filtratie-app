import { fetchData } from "../../services/fetch.js";
import {
  renderNotifications,
  initNotificationActions,
} from "../../render/notificationsRenderer.js";

export function showNotification(message, type, duration = 2000) {
  removeExistingNotifications();

  const $notification = document.createElement("div");
  $notification.setAttribute("data-notification", type);
  $notification.textContent = message;

  const colors = getNotificationColor(type);
  Object.assign($notification.style, {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    zIndex: "9999",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    color: colors.color,
    fontSize: "1rem",
    fontWeight: "500",
    maxWidth: "300px",
    boxShadow: "var(--shadow-subtle)",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    backgroundColor: colors.background,
    border: `2px solid ${colors.color}`,
  });

  document.body.appendChild($notification);

  requestAnimationFrame(() => {
    $notification.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    removeNotification($notification);
  }, duration);
}

function getNotificationColor(type) {
  const colors = {
    success: {
      background: "var(--success-muted-color)",
      color: "var(--success-color)",
    },
    error: {
      background: "var(--alert-muted-color)",
      color: "var(--alert-color)",
    },
  };
  return colors[type];
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)";
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function removeExistingNotifications() {
  const existingNotifications = document.querySelectorAll(
    "[data-notification]"
  );
  existingNotifications.forEach(removeNotification);
}

// Polling for notification count
let notificationPollingInterval = null;

export async function initNotificationsPolling() {
  await updateNotificationCount();
  await updateNotificationsList();

  startNotificationPolling();
}

export async function updateNotificationCount() {
  const $notificationsCounters = document.querySelectorAll(
    "[data-notification-counter]"
  );

  if ($notificationsCounters.length === 0) {
    return;
  }

  try {
    const data = await fetchData("notifications/unread-count");
    const newCount = data.count || 0;
    $notificationsCounters.forEach(($counter) => {
      const currentCount = parseInt($counter.textContent) || 0;

      $counter.textContent = newCount;

      // Hide counter when count is 0, show when count > 0
      if (newCount === 0) {
        $counter.style.display = 'none';
      } else {
        $counter.style.display = '';
      }

      if (newCount !== currentCount && currentCount > 0) {
        if (newCount > currentCount) {
          animateCounterIncrease($counter);
        } else if (newCount < currentCount) {
          animateCounterDecrease($counter);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching notification count:", error);
  }
}

export function startNotificationPolling(intervalMs = 5000) {
  stopNotificationPolling();

  notificationPollingInterval = setInterval(async () => {
    await updateNotificationCount();
    await updateNotificationsList();
  }, intervalMs);
}

export function stopNotificationPolling() {
  if (notificationPollingInterval) {
    clearInterval(notificationPollingInterval);
    notificationPollingInterval = null;
  }
}

function animateCounterIncrease($counter) {
  $counter.style.transform = "scale(1.2)";
  $counter.style.transition = "transform 0.2s ease-in-out";

  setTimeout(() => {
    $counter.style.transform = "scale(1)";
  }, 200);
}

function animateCounterDecrease($counter) {
  $counter.style.transform = "scale(0.9)";
  $counter.style.transition = "transform 0.2s ease-in-out";

  setTimeout(() => {
    $counter.style.transform = "scale(1)";
  }, 200);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopNotificationPolling();
  } else {
    startNotificationPolling();
  }
});

window.addEventListener("beforeunload", () => {
  stopNotificationPolling();
});

// Store notification containers for polling
let notificationContainers = [];

export function initNotificationsList() {
  const containers = document.querySelectorAll(
    '[data-container="notifications-list"]'
  );

  if (containers.length === 0) {
    return;
  }

  containers.forEach((container) => {
    notificationContainers.push(container);
    initNotificationActions(container);
  });

  updateNotificationsList();
}

export async function updateNotificationsList() {
  if (notificationContainers.length === 0) {
    return;
  }

  try {
    const notifications = await fetchData("notifications");

    notificationContainers.forEach((container) => {
      renderNotifications(notifications, container);
    });
  } catch (error) {
    console.error("Error updating notifications list:", error);
  }
}
