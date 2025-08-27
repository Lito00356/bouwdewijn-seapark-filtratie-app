function convertCommaInputs(form) {
  if (!form) return;
  
  const $inputs = form.querySelectorAll("[data-decimal-input]");
  $inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const originalValue = e.target.value;
      const newValue = originalValue.replace(/,/g, ".");
      
      if (originalValue !== newValue) {
        const inputName = input.name;
        e.target.value = newValue;
      }
    });
  });
}

export function initConvertCommaToDot() {
  const $forms = document.querySelectorAll("form[data-convert-comma-to-dot]");
  $forms.forEach((form) => {
    convertCommaInputs(form);
  });
}
