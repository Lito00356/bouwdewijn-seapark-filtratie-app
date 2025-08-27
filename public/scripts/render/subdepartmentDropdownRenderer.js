import { formatSubdepartmentName } from "../utils/systems/subdepartmentUtils.js";

export function renderSubdepartmentOption(subdepartment, isSelected = false) {
  const option = document.createElement("option");
  option.value = subdepartment.id;
  const displayName = formatSubdepartmentName(subdepartment.name);

  option.textContent = displayName;
  option.className = "text-lg bg-blocks";
  option.selected = isSelected;
  option.setAttribute("data-original-name", subdepartment.name);

  return option;
}

export function updateSubdepartmentDropdown(selectElement, subdepartments) {
  clearDropdownOptions(selectElement);

  if (subdepartments.length === 0) {
    hideSubdepartmentSection(selectElement);
    return;
  }

  showSubdepartmentSection(selectElement, subdepartments);
  populateDropdownOptions(selectElement, subdepartments);
  triggerDropdownChangeEvent(selectElement);
}

export function clearDropdownOptions(selectElement) {
  selectElement.innerHTML = "";
}

function hideSubdepartmentSection(selectElement) {
  const subdepartmentSection = selectElement.closest("section");
  if (subdepartmentSection) {
    subdepartmentSection.style.display = "none";
  }
}

function showSubdepartmentSection(selectElement, subdepartments) {
  const subdepartmentSection = selectElement.closest("section");
  if (subdepartmentSection) {
    const shouldShow = subdepartments.length > 1;
    subdepartmentSection.style.display = shouldShow ? "block" : "none";
  }
}

function populateDropdownOptions(selectElement, subdepartments) {
  subdepartments.forEach((subdept, index) => {
    const option = renderSubdepartmentOption(subdept, index === 0);
    selectElement.appendChild(option);
  });
}

// zodat andere scripts kunnen luisteren naar de change event en kunnen reageren
function triggerDropdownChangeEvent(selectElement) {
  selectElement.dispatchEvent(new Event("change"));
}
