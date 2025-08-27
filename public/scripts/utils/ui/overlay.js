export function createOverlay(className = "overlay") {
  const $overlay = document.createElement("div");
  $overlay.className = className;
  $overlay.setAttribute("aria-hidden", "true");

  document.body.appendChild($overlay);
  return $overlay;
}

export function showOverlay($overlay) {
  $overlay.classList.add("visible");
}

export function hideOverlay($overlay) {
  $overlay.classList.remove("visible");
}

export function removeOverlay($overlay) {
  if ($overlay && $overlay.parentNode) {
    $overlay.parentNode.removeChild($overlay);
  }
}
