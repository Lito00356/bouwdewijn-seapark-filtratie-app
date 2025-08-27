import { createOverlay, showOverlay, hideOverlay } from "./overlay.js";

export function initMobileNavToggle() {
  const $hamburgerBtn = document.querySelector('[data-icon="hamburger"]');
  const $closeBtn = document.querySelector('[data-icon="close"]');
  const $mobileNav = document.querySelector('[data-nav="mobile"]');

  if (!$hamburgerBtn || !$closeBtn || !$mobileNav) return;

  const $overlay = createOverlay("nav-overlay");

  function openNav() {
    $mobileNav.classList.remove("translate-x-100");
    $mobileNav.classList.add("translate-x-0");
    showOverlay($overlay);
    $hamburgerBtn.classList.add("hidden");
    $closeBtn.classList.remove("hidden");

    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    $mobileNav.classList.remove("translate-x-0");
    $mobileNav.classList.add("translate-x-100");
    hideOverlay($overlay);
    $hamburgerBtn.classList.remove("hidden");
    $closeBtn.classList.add("hidden");

    document.body.style.overflow = "";
  }
  $hamburgerBtn.addEventListener("click", openNav);
  $closeBtn.addEventListener("click", closeNav);

  $overlay.addEventListener("click", closeNav);
}
