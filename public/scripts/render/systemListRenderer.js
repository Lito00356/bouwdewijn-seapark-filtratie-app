import { getItemsByObjectType } from "../utils/domUtils.js";

export function renderSystemList(
  departmentSubdepartments,
  departmentFilters,
  departmentPumps
) {
  // Find all task buttons
  const $taskButtons = document.querySelectorAll(
    'button[data-trigger^="modal-task-"]'
  );

  $taskButtons.forEach((button) => {
    const objectType = button.getAttribute("data-object-type");
    if (!objectType) return;

    // Get the system list container (the div with grids)
    const $systemListContainer = button.querySelector(
      '[data-container="system-list"]'
    );
    if (!$systemListContainer) return;

    // Get appropriate items based on object type
    const items = getItemsByObjectType(
      objectType,
      departmentSubdepartments,
      departmentFilters,
      departmentPumps
    );

    if (items.length === 0) {
      $systemListContainer.innerHTML = "";
      return;
    }

    let gridClass = "grid--2";
    if (items.length <= 2) {
      gridClass = "grid--2";
    } else if (items.length === 3 || items.length === 6) {
      gridClass = "grid--3";
    } else if (items.length >= 4) {
      gridClass = "grid--4";
    }

    if (objectType === "pump" && items.length >= 5) {
      gridClass += " grid--center";
    }

    let systemGridsHTML = "";

    if (objectType === "sub_department") {
      if (items.length <= 2) {
        systemGridsHTML = `
          <ul class="grid grid--2 grid--items-center w-full">
            ${items
              .map(
                (item, index) => `
              <li class="${
                items.length === 1 ? "span-2" : ""
              } w-full text-center">
                ${item.name}
              </li>
            `
              )
              .join("")}
          </ul>
        `;
      } else if (items.length === 3) {
        systemGridsHTML = `
          <ul class="grid grid--2 grid--items-center gap-sm w-full">
            ${items
              .slice(0, 2)
              .map(
                (item) => `
              <li class="w-full text-center">${item.name}</li>
            `
              )
              .join("")}
          </ul>
          <ul class="grid grid--2 grid--items-center gap-sm w-full">
            <li class="span-full w-full text-center">${items[2].name}</li>
          </ul>
        `;
      } else {
        systemGridsHTML = `
          <ul class="grid grid--2 grid--items-center gap-sm w-full">
            ${items
              .slice(0, 2)
              .map(
                (item) => `
              <li class="w-full text-center">${item.name}</li>
            `
              )
              .join("")}
          </ul>
        `;
        if (items.length >= 3) {
          systemGridsHTML += `
            <ul class="grid grid--2 grid--items-center gap-sm w-full">
              <li class="span-full w-full text-center">${items[2].name}</li>
            </ul>
          `;
        }
        if (items.length >= 4) {
          systemGridsHTML += `
            <ul class="grid grid--2 grid--items-center gap-sm w-full">
              ${items
                .slice(3)
                .map(
                  (item, index) => `
                <li class="${
                  items.slice(3).length === 1 ? "span-full" : ""
                } w-full text-center">
                  ${item.name}
                </li>
              `
                )
                .join("")}
            </ul>
          `;
        }
      }
    } else if (items.length <= 4) {
      systemGridsHTML = `
        <ul class="grid ${gridClass} grid--items-center gap-sm w-full">
          ${items
            .map(
              (item) => `
            <li class="${
              items.length === 1 ? "span-2" : ""
            } w-full text-center">
              ${item.name}
            </li>
          `
            )
            .join("")}
        </ul>
      `;
    } else {
      systemGridsHTML = `
        <ul class="grid grid--4 grid--items-center gap-sm w-full">
          ${items
            .slice(0, 4)
            .map(
              (item) => `
            <li class="w-full text-center">${item.name}</li>
          `
            )
            .join("")}
        </ul>
      `;

      if (items.length === 5) {
        systemGridsHTML += `
          <ul class="grid grid--2 grid--items-center gap-sm w-full">
            <li class="span-full w-full text-center">${items[4].name}</li>
          </ul>
        `;
      } else if (items.length === 6) {
        systemGridsHTML += `
          <ul class="grid grid--2 grid--items-center gap-sm w-full">
            ${items
              .slice(4, 6)
              .map(
                (item) => `
              <li class="w-full text-center">${item.name}</li>
            `
              )
              .join("")}
          </ul>
        `;
      } else if (items.length === 7) {
        systemGridsHTML += `
          <ul class="grid grid--3 grid--items-center gap-sm w-full">
            ${items
              .slice(4, 7)
              .map(
                (item) => `
              <li class="w-full text-center">${item.name}</li>
            `
              )
              .join("")}
          </ul>
        `;
      } else if (items.length >= 8) {
        systemGridsHTML += `
          <ul class="grid grid--4 grid--items-center gap-sm w-full">
            ${items
              .slice(4, 8)
              .map(
                (item) => `
              <li class="w-full text-center">${item.name}</li>
            `
              )
              .join("")}
          </ul>
        `;
        if (items.length >= 9) {
          systemGridsHTML += `
            <ul class="grid grid--4 grid--items-center gap-sm w-full">
              ${items
                .slice(8)
                .map(
                  (item) => `
                <li class="w-full text-center">${item.name}</li>
              `
                )
                .join("")}
            </ul>
          `;
        }
      }
    }

    $systemListContainer.innerHTML = systemGridsHTML;
  });
}
