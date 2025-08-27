function displayFaultyInput(input) {
  input.style.borderColor = "red";
  input.style.backgroundColor = "#ffe6e6";
}

export function resetInputStyling(input) {
  input.style.borderColor = "";
  input.style.backgroundColor = "";
}

export function resetAllInputStyling(form) {
  if (!form) return;

  const $inputs = form.querySelectorAll("[data-decimal-input]");
  $inputs.forEach((input) => {
    resetInputStyling(input);
  });
}

function validateSingleInput(input) {
  const value = input.value.trim();
  const inputName = input.name;

  if (value === "") {
    return { isValid: true };
  }

  if (value.toLowerCase().includes("e")) {
    console.warn(
      `❌ ${inputName}: "${value}" - INVALID (scientific notation not allowed)`
    );
    displayFaultyInput(input);
    input.setCustomValidity("Scientific notation (e/E) is not allowed");
    return { isValid: false };
  }

  const convertedNumber = Number(value);
  const isInvalidNumber = isNaN(convertedNumber) || !isFinite(convertedNumber);
  if (isInvalidNumber) {
    displayFaultyInput(input);
    input.setCustomValidity(`"${value}" is not a valid number`);
    return { isValid: false };
  }

  input.value = convertedNumber;
  input.setCustomValidity("");
  resetInputStyling(input);
  return { isValid: true };
}

export function validateAndConvertToNumbers(form) {
  if (!form) return false;
  const $inputs = form.querySelectorAll("[data-decimal-input]");
  let hasErrors = false;

  $inputs.forEach((input) => {
    const result = validateSingleInput(input);
    if (!result.isValid) {
      hasErrors = true;
    }
  });

  if (hasErrors) {
    console.warn("🚫 Form validation failed");
    form.reportValidity();
    return false;
  }
  return true;
}

function setupFormNumberValidation(form) {
  if (!form) return;
  const $submitButton = form.querySelector("[data-validate]");

  if ($submitButton) {
    $submitButton.addEventListener("click", (e) => {
      const isValid = validateAndConvertToNumbers(form);
      if (!isValid) {
        console.warn("🚫 Form submission blocked due to validation errors");
        e.preventDefault();
        return;
      }
    });
  } else {
    console.warn(`⚠️ No submit button found for form: ${form}`);
  }
}

export function initFormNumberValidation() {
  const $forms = document.querySelectorAll("form[data-number-validation]");

  $forms.forEach((form) => {
    setupFormNumberValidation(form);
  });
}
