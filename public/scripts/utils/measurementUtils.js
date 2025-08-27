export function collectMeasurementData(form) {
  const measurements = {};
  const measurementDetails = [];
  const emptyInputs = [];
  const outOfRangeValues = [];

  const $measurementInputs = form.querySelectorAll("[data-decimal-input]");

  $measurementInputs.forEach((input) => {
    const value = input.value.trim();
    const name = input.name;
    const measurementKey = input.getAttribute("data-measurement-key");
    const unit =
      input.parentElement.querySelector("span")?.textContent.trim() || "";
    const minValue = input.getAttribute("data-min");
    const maxValue = input.getAttribute("data-max");

    if (value !== "") {
      const numericValue = Number(value);
      const displayValue = isColiformMeasurement(name)
        ? numericValue * 100
        : numericValue;

      // Store in measurements object with measurement_key
      measurements[measurementKey] = isColiformMeasurement(name)
        ? numericValue * 100
        : numericValue;

      // Keep measurement details for validation and display
      measurementDetails.push({
        name: name,
        measurementKey: measurementKey,
        value: numericValue,
        displayValue: displayValue,
        unit: unit,
        minValue: minValue ? Number(minValue) : null,
        maxValue: maxValue ? Number(maxValue) : null,
      });
    } else {
      emptyInputs.push({
        name: name,
        measurementKey: measurementKey,
        unit: unit,
      });
    }
  });

  updateCombinedChlorineMaxValue(measurementDetails);

  // Now check for out-of-range values after updating combined chlorine max value
  measurementDetails.forEach((measurement) => {
    const name = measurement.name;
    const displayValue = measurement.displayValue;
    const unit = measurement.unit;
    const minValue = measurement.minValue;
    const maxValue = measurement.maxValue;

    if (minValue !== null && displayValue < minValue) {
      outOfRangeValues.push({
        name: name,
        value: displayValue.toFixed(3),
        unit: unit,
        type: "min",
        limit: minValue,
      });
    }
    if (maxValue !== null && displayValue > maxValue) {
      outOfRangeValues.push({
        name: name,
        value: displayValue.toFixed(3),
        unit: unit,
        type: "max",
        limit: maxValue,
      });
    }
  });

  const $commentsTextarea = form.querySelector("[data-measurements-comment]");
  const userComments = $commentsTextarea ? $commentsTextarea.value.trim() : "";
  const $commentTypeSelect = form.querySelector(
    "[data-select='comment-type-choice']"
  );
  let commentType = $commentTypeSelect
    ? $commentTypeSelect.value
    : "observation";

  let autoComment = "";
  if (outOfRangeValues.length > 0) {
    const outOfRangeMessages = outOfRangeValues.map(
      (item) =>
        `- ${replaceChlorineWithCl(item.name)}: ${item.value} ${item.unit} (${
          item.type
        }: ${item.limit} ${item.unit})`
    );
    autoComment = outOfRangeMessages.join("\n");
  }

  const combinedComments = [autoComment, userComments]
    .filter(Boolean)
    .join("\n");

  return {
    measurements,
    measurementDetails,
    emptyInputs,
    outOfRangeValues,
    comment: combinedComments,
    commentType,
    userComments,
  };
}

function updateCombinedChlorineMaxValue(measurementDetails) {
  const totalChlorineMeasurement = measurementDetails.find(
    (m) => m.name === "Total chlorine"
  );
  const combinedChlorineMeasurement = measurementDetails.find(
    (m) => m.name === "Combined Chlorine"
  );

  if (totalChlorineMeasurement && combinedChlorineMeasurement) {
    const totalValue = totalChlorineMeasurement.value;
    combinedChlorineMeasurement.maxValue = totalValue * 0.2;
  }
}

export function replaceChlorineWithCl(name) {
  return name.replace(/Chlorine/gi, "Cl");
}

export function isColiformMeasurement(measurementName) {
  return measurementName === "Total Coliforms" || measurementName === "E coli";
}

function updateCombinedChlorine(free, total, combined) {
  const freeValue = free.value.trim();
  const totalValue = total.value.trim();

  // Only calculate if 1 valid
  if (freeValue === "" && totalValue === "") {
    combined.value = "";
    return;
  }

  const combinedValue = totalValue - freeValue;
  combined.value = combinedValue.toFixed(3);

  combinedChlorineValidation(combinedValue, totalValue, combined);
}

function combinedChlorineValidation(
  combinedValue,
  totalValue,
  combinedChlorineInput
) {
  const maxValue = totalValue * 0.2;

  combinedChlorineInput.style.color = "";

  if (combinedValue > maxValue) {
    combinedChlorineInput.style.color = "var(--alert-color)";
  }
}

export function initRealTimeChlorineCalculation() {
  const $freeChlorineInput = document.querySelector(
    'input[name="Free chlorine"]'
  );
  const $totalChlorineInput = document.querySelector(
    'input[name="Total chlorine"]'
  );
  const $combinedChlorineInput = document.querySelector(
    'input[name="Combined Chlorine"]'
  );

  if (!$freeChlorineInput || !$totalChlorineInput || !$combinedChlorineInput) {
    return;
  }

  updateCombinedChlorine(
    $freeChlorineInput,
    $totalChlorineInput,
    $combinedChlorineInput
  );

  $freeChlorineInput.addEventListener("input", () =>
    updateCombinedChlorine(
      $freeChlorineInput,
      $totalChlorineInput,
      $combinedChlorineInput
    )
  );
  $totalChlorineInput.addEventListener("input", () =>
    updateCombinedChlorine(
      $freeChlorineInput,
      $totalChlorineInput,
      $combinedChlorineInput
    )
  );
}
