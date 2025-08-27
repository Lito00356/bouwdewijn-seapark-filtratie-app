import {
  updateNotificationCount,
} from "../utils/ui/notifications.js";
import { parseBackendDate } from "../utils/dateUtils.js";
import { markNotificationAsRead, markAllNotificationsAsRead } from "../services/notificationService.js";

export function renderNotifications(notifications, container) {
  if (!container) {
    console.warn("Container not found for notifications");
    return;
  }

  container.innerHTML = "";

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read
  );

  if (unreadNotifications.length === 0) {
    container.innerHTML = `
      <li class="text-center text-muted p-lg">
        <p>No unread notifications</p>
      </li>
    `;
    return;
  }

  const sortedNotifications = unreadNotifications.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  sortedNotifications.forEach((notification) => {
    const notificationElement = createNotificationElement(notification);
    container.appendChild(notificationElement);
  });
}

function createNotificationElement(notification) {
  const $notification = document.createElement("li");
  // Use the formatted date that's already in Belgium timezone
  const timeAgo = getTimeAgo(notification.created_at_formatted);

  $notification.className =
    "flex flex--col gap-sm p-md bg-blocks border rounded relative";
  $notification.setAttribute("data-notification-id", notification.id);

  const titleClass = getNotificationTitleClass(notification.comment_type);

  $notification.innerHTML = `
    <div class="flex flex--between gap-sm">
      <h3 class="${titleClass}">${notification.title}</h3>
      <svg class="icon icon--base icon--remove pointer notification-close"
            data-mark-as-read="${notification.id}">
        <use href="/assets/icons/sprite.svg#close-icon"></use>
      </svg>
    </div>
    <div class="flex flex--col gap-xs">
      <p>${notification.message}</p>
      <span class="text-md text-muted text-right">${timeAgo}</span>
    </div>
  `;

  return $notification;
}

function getNotificationTitleClass(commentType) {
  switch (commentType) {
    case "error":
      return "text-base text-alert";
    case "observation":
      return "text-base text-warning";
    default:
      return "text-base";
  }
}

function getTimeAgo(formattedDateString) {
  const created = parseBackendDate(formattedDateString, true);

  if (isNaN(created.getTime())) {
    console.error("Invalid date parsed:", formattedDateString);
    return "Invalid date";
  }

  const now = new Date();
  const diffMs = now - created;

  if (diffMs < 0) {
    return "Just now";
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) {
    return diffSecs <= 1 ? "Just now" : `${diffSecs} seconds ago`;
  } else if (diffMins < 60) {
    return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  } else {
    const diffYears = Math.floor(diffMonths / 12);
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
  }
}

async function handleNotificationClick(event) {
  const $button = event.target.closest("[data-mark-as-read]");
  if (!$button) return;

  const notificationId = $button.getAttribute("data-mark-as-read");
  const $container = event.currentTarget;

  try {
    await markNotificationAsRead(notificationId);

    const $notification = $button.closest("li");
    $notification.remove();

    if ($container.children.length === 0) {
      renderNotifications([], $container);
    }

    await updateNotificationCount();
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

async function handleMarkAllAsRead() {
  const $container = document.querySelector(
    '[data-container="notifications-list"]'
  );

  if (!$container) {
    console.error(
      "Could not find notifications container for mark all as read"
    );
    return;
  }

  try {
    await markAllNotificationsAsRead();
    renderNotifications([], $container);
    await updateNotificationCount();
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
}

export function initNotificationActions(container) {
  if (!container) {
    console.error("Container is required for notification actions");
    return;
  }

  container.removeEventListener("click", handleNotificationClick);
  container.addEventListener("click", handleNotificationClick);

  const $markAllButtons = document.querySelectorAll(
    '[data-action="mark-all-as-read"]'
  );
  $markAllButtons.forEach(($button) => {
    $button.removeEventListener("click", handleMarkAllAsRead);
    $button.addEventListener("click", handleMarkAllAsRead);
  });
}
