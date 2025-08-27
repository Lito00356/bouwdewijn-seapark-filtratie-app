function closeAllDropdowns() {
  document.querySelectorAll(".dropdown__menu.show").forEach((menu) => {
    menu.classList.remove("show");
  });
}

function handleDropdownToggle(trigger) {
  const dropdown = trigger.closest(".dropdown");
  const menu = dropdown.querySelector(".dropdown__menu");

  closeAllDropdowns();
  menu.classList.toggle("show");
}

export function handleDropdownClick(e) {
  const trigger = e.target.closest(".dropdown__trigger");

  if (trigger) {
    e.preventDefault();
    handleDropdownToggle(trigger);
  } else {
    closeAllDropdowns();
  }
}
