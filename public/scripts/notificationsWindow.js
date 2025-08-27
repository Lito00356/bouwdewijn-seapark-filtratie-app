const $notificationBell = document.getElementById("notification-bell");
const $notificationModal = document.getElementById("notifications-section");
const $modalBg = document.getElementById("modal-bg");

function openNotificationsModal() {
  $modalBg.classList.add("open");
  $notificationModal.classList.add("open");
  $notificationBell.classList.add("open");
}

function closeNotificationsModal() {
  $modalBg.classList.remove("open");
  $notificationModal.classList.remove("open");
  $notificationBell.classList.remove("open");
}

$notificationBell.addEventListener("click", function (event) {
  openNotificationsModal();
});

window.addEventListener("click", function (event) {
  if (event.target == $modalBg) {
    closeNotificationsModal();
  }
});
