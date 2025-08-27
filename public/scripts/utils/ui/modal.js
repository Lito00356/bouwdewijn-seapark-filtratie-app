export function openModal(modalName) {
  const $modal = document.querySelector(`dialog[data-modal="${modalName}"]`);
  $modal.showModal();

  const $closeButtons = $modal.querySelectorAll("[data-close]");

  const closeHandler = () => $modal.close();

  $closeButtons.forEach(($closeButton) => {
    $closeButton.addEventListener("click", closeHandler);
  });

  const clickOutsideHandler = (e) => {
    if (e.target === $modal) {
      $modal.close();
    }
  };
  $modal.addEventListener("click", clickOutsideHandler);

  const cleanupHandler = () => {
    $closeButtons.forEach(($closeButton) => {
      $closeButton.removeEventListener("click", closeHandler);
    });
    $modal.removeEventListener("click", clickOutsideHandler);
    $modal.removeEventListener("close", cleanupHandler);
  };
  $modal.addEventListener("close", cleanupHandler);
}

export function initModals() {
  const $triggers = document.querySelectorAll("button[data-trigger]");

  $triggers.forEach(($trigger) => {
    $trigger.addEventListener("click", () => {
      
      setTimeout(() => {
        openModal($trigger.getAttribute("data-trigger"));
      }, 0);
    });
  });
}
