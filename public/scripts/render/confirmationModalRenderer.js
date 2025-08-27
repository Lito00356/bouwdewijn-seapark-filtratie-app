import {
  replaceChlorineWithCl,
  isColiformMeasurement,
} from "../utils/measurementUtils.js";

export function displayConfirmationModalData(data) {
  const $confirmInputs = document.querySelector("[data-confirm-inputs]");

  if (!$confirmInputs) {
    return;
  }

  $confirmInputs.innerHTML = "";

  data.measurementDetails.forEach((measurement) => {
    const $listItem = document.createElement("li");
    $listItem.className = "flex flex--between gap-sm";
    const numericValue = Number(measurement.value);

    const displayValue = isColiformMeasurement(measurement.name)
      ? numericValue * 100
      : numericValue;
    const validationValue = displayValue;

    let isOutOfRange = false;

    if (!isNaN(validationValue)) {
      if (
        measurement.minValue !== null &&
        validationValue < measurement.minValue
      ) {
        isOutOfRange = true;
      }
      if (
        measurement.maxValue !== null &&
        validationValue > measurement.maxValue
      ) {
        isOutOfRange = true;
      }
    }
    const valueStyle = isOutOfRange ? 'style="color: var(--alert-color);"' : "";

    $listItem.innerHTML = `
      <span class="text-base font-medium">${replaceChlorineWithCl(
        measurement.name
      )}:</span>
      <div class="flex flex--center gap-sm">
        <span class="text-base" ${valueStyle}>${displayValue}</span>
        <span class="text-base">${measurement.unit}</span>
      </div>
    `;

    $confirmInputs.appendChild($listItem);
  });

  if (data.emptyInputs && data.emptyInputs.length > 0) {
    const $warningItem = document.createElement("li");
    $warningItem.className = "flex flex--col gap-xs";

    const emptyInputsList = data.emptyInputs
      .map(
        (input) =>
          `<li class="text-md">• ${replaceChlorineWithCl(input.name)}</li>`
      )
      .join("");

    $warningItem.innerHTML = `
      <span class="text-base font-medium text-warning">&#9888; Warning! Empty inputs:</span>
      <ul>
        ${emptyInputsList}
      </ul>
    `;

    $confirmInputs.appendChild($warningItem);
  }

  if (data.outOfRangeValues && data.outOfRangeValues.length > 0) {
    const $outOfRangeItem = document.createElement("li");
    $outOfRangeItem.className = "flex flex--col gap-xs";
    const outOfRangeList = data.outOfRangeValues
      .map(
        (item) =>
          `<li class="text-md" style="color: var(--alert-color);">• ${replaceChlorineWithCl(
            item.name
          )}: ${item.value}${item.unit} (${
            item.type === "below" ? "min" : "max"
          }: ${item.limit}${item.unit})</li>`
      )
      .join("");

    $outOfRangeItem.innerHTML = `
      <span class="text-base font-medium" style="color: var(--alert-color);">&#9888; Out of Range Values:</span>
      <ul>
        ${outOfRangeList}
      </ul>
    `;

    $confirmInputs.appendChild($outOfRangeItem);
  }
  if (data.comment) {
    const commentType = data.commentType || "observation";
    const capitalizedCommentType =
      commentType.charAt(0).toUpperCase() + commentType.slice(1);
    const $commentsItem = document.createElement("li");
    $commentsItem.className =
      "flex flex--col gap-xs p-sm border-2 rounded bg-gray-accent-muted";

    $commentsItem.innerHTML = `
      <span class="text-base font-medium">${capitalizedCommentType} comments:</span>
      <span class="text-md" style="white-space: pre-line; text-align: left;">${data.comment}</span>
    `;

    $confirmInputs.appendChild($commentsItem);
  }
}
