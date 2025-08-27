export function displayValidation(message, status, errors, container) {
  const $container = document.querySelector(`.${container}`);
  const $validation = $container.querySelector(".validation");

  if ($validation) {
    $validation.remove();
  }

  let content = `<p>${message}</p>`;
  if (errors) {
    const errorMessages = errors
      .map((error) => `<li class="error-list__item";">${error.msg}</li>`)
      .join("");
    content += `<ul class="error-list">${errorMessages}</ul>`;
  }

  $container.insertAdjacentHTML(
    "afterbegin",
    `<div class="validation" style="background-color:${
      status >= 200 && status < 300 ? "#65c38d" : "#fe2525"
    }">${content}</div>`
  );
}
