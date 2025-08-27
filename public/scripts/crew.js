import { API, fetchData } from "./services/fetch.js";
import { showNotification } from "./utils/ui/notifications.js";

export async function initCrew() {
  // Check if we're on the crew page
  if (!window.location.pathname.includes("crew")) {
    return;
  }

  const $activeCrew = document.getElementById("active-crew");
  const $inActiveCrew = document.getElementById("inactive-crew");

  if (!$activeCrew || !$inActiveCrew) {
    return;
  }

  try {
    const users = await fetchData(getCurrentEndpoint());
    const allDbUsers = users.allUsers; // Initialize the page
    createUserItems(allDbUsers);
    initFormHandlers();
  } catch (error) {
    console.error("❌ Error initializing crew management:", error);
  }
}

function getCurrentEndpoint() {
  const pathParts = window.location.pathname.split("/");
  let endpoint = pathParts[pathParts.length - 1];

  if (endpoint !== "users") {
    endpoint = "users";
  }
  return endpoint;
}

function createUserItems(users) {
  const $activeCrew = document.getElementById("active-crew");
  const $inActiveCrew = document.getElementById("inactive-crew");

  if (!$activeCrew || !$inActiveCrew) {
    return;
  }
  $activeCrew.innerHTML = "";
  $inActiveCrew.innerHTML = "";
  users.forEach((user) => {
    const userArticle = document.createElement("article");
    userArticle.className = user.is_active ? "crew__item" : "crew__item inactive";
    userArticle.dataset.userId = user.id;
    userArticle.dataset.userJson = JSON.stringify(user); // Store user data in DOM

    userArticle.innerHTML = `
        <span class="crew__first-name">${user.firstname}</span>
        <span class="crew__last-name">${user.lastname}</span>
        <span class="crew__ci">${user.email}</span>
        <div class="settings-container">
        <button class="btn crew__settings button--open" data-open-edit="${user.id}">
        <svg class="icon icon--base">
        <use href="/assets/icons/sprite.svg#dots-icon"></use>
        </svg>
        </button>
        <button class="btn crew__settings button--close" data-close-edit="${user.id}">
        <svg class="icon icon--base">
        <use href="/assets/icons/sprite.svg#close-icon"></use>
        </svg>
        </button>
        </div>
        <button class="crew__settings-edit" data-edit-user="${user.id}">
        edit
        </button>
        `;

    if (user.is_active) {
      $activeCrew.appendChild(userArticle);
    } else {
      $inActiveCrew.appendChild(userArticle);
    }
  });
  addEventListeners();
}

function displayEditFields($article, user) {
  let activeUser = user.is_active == 1 ? "Yes" : "No";
  let admin = user.is_admin == 1 ? "Yes" : "No";

  $article.innerHTML = `
        <span class="crew__first-name">First name</span>
        <span class="crew__last-name">Last name</span>
        <span class="crew__ci">Contact info</span>
        <span class="crew__is-active">Is active</span>
        <span class="crew__pin">Pin code</span>
        <span class="crew__is-admin">Admin</span>
        
        <form class="form"  id="edit-user-form" data-edit-form="${user.id}">
            <input class="form__input form__first-name" id="user-first-name" value="${user.firstname}"></input>
            <input class="form__input form__last-name" id="user-last-name" value="${user.lastname}"></input>
            <input class="form__input form__ci" id="user-contact-info" value="${user.email}"></input>
            <select class="form__input form__is-active" id="user-is-active">
                <option value="Yes" ${activeUser === "Yes" ? "selected" : ""}>Yes</option>
                <option value="No" ${activeUser === "No" ? "selected" : ""}>No</option>
            </select>
            <input class="form__input form__is-active" id="user-pin" value="" placeholder="●●●●" maxlength="4"></input>
            <select class="form__input form__is-admin" id="user-is-admin">
                <option value="Yes" ${admin === "Yes" ? "selected" : ""}>Yes</option>
                <option value="No" ${admin === "No" ? "selected" : ""}>No</option>
            </select>
            <div class="form__buttons">
                <button class="form__button confirm" type="submit" data-edit-confirm="${user.id}">
                    Ok
                </button>
                <button class="form__button cancel" type="button" data-edit-cancel="${user.id}">
                    Cancel
                </button>
            </div>
        </form>
    
    `;
}

function hideEditFields($article, user) {
  $article.innerHTML = `
        <span class="crew__first-name">${user.firstname}</span>
        <span class="crew__last-name">${user.lastname}</span>
        <span class="crew__ci">${user.email}</span>
        <div class="settings-container">
            <button class="btn crew__settings button--open" data-open-edit="${user.id}">
                <svg class="icon icon--base">
                    <use href="/assets/icons/sprite.svg#dots-icon"></use>
                </svg>
            </button>
            <button class="btn crew__settings button--close" data-close-edit="${user.id}">
                <svg class="icon icon--base">
                    <use href="/assets/icons/sprite.svg#close-icon"></use>
                </svg>
            </button>
        </div>
        <button class="crew__settings-edit" data-edit-user="${user.id}">
            edit
        </button>
        `;

  addEventListenersToArticle($article);
}

function addEventListeners() {
  const $articles = document.querySelectorAll(".crew__item");
  $articles.forEach(($article) => {
    addEventListenersToArticle($article);
  });
}

function addEventListenersToArticle($article) {
  const $settingsButton = $article.querySelector("button[data-open-edit]");
  const $cancelButton = $article.querySelector("button[data-close-edit]");
  const $editButton = $article.querySelector("button[data-edit-user]");

  if ($settingsButton) {
    $settingsButton.addEventListener("click", function (event) {
      const userId = $settingsButton.dataset.openEdit;
      $settingsButton.classList.add("open");
      $settingsButton.blur();

      const $closeButton = $article.querySelector(`button[data-close-edit="${userId}"]`);
      const $editMenu = $article.querySelector(`button[data-edit-user="${userId}"]`);
      if ($closeButton) $closeButton.classList.add("open");
      if ($editMenu) $editMenu.classList.add("open");
    });
  }

  if ($cancelButton) {
    $cancelButton.addEventListener("click", function (event) {
      const userId = $cancelButton.dataset.closeEdit;
      $cancelButton.classList.remove("open");
      $cancelButton.blur();

      const $settingButton = $article.querySelector(`button[data-open-edit="${userId}"]`);
      const $editMenu = $article.querySelector(`button[data-edit-user="${userId}"]`);
      if ($settingButton) $settingButton.classList.remove("open");
      if ($editMenu) $editMenu.classList.remove("open");
    });
  }
  if ($editButton) {
    $editButton.addEventListener("click", function () {
      const userId = $editButton.dataset.editUser;
      const user = JSON.parse($article.dataset.userJson); // Get user data from DOM

      $article.classList.add("editing");
      $article.classList.remove("inactive");
      displayEditFields($article, user);

      const $form = document.getElementById("edit-user-form");
      const $confirmEdit = $article.querySelector("button[data-edit-confirm]");
      const $cancelEdit = $article.querySelector("button[data-edit-cancel]");

      if ($cancelEdit) {
        $cancelEdit.addEventListener(
          "click",
          function () {
            $article.classList.remove("editing");
            if (user.is_active == 0) {
              $article.classList.add("inactive");
            }
            hideEditFields($article, user);
          },
          { once: true }
        );
      }
      if ($confirmEdit) {
        $confirmEdit.addEventListener("click", function (event) {
          event.preventDefault();
          updateUser($form, $article, userId);
        });
      }
    });
  }
}

async function updateUser($form, $article, userId) {
  const $firstName = $form.querySelector("#user-first-name").value;
  const $lastName = $form.querySelector("#user-last-name").value;
  const $contactInfo = $form.querySelector("#user-contact-info").value;
  const $isActive = $form.querySelector("#user-is-active").value;
  const $pinCode = $form.querySelector("#user-pin").value;
  const $isAdmin = $form.querySelector("#user-is-admin").value;

  let activeUser = $isActive.toLowerCase() === "yes" ? 1 : 0;
  let admin = $isAdmin.toLowerCase() === "yes" ? 1 : 0;

  const updatedUser = {
    id: parseInt(userId),
    firstname: $firstName,
    lastname: $lastName,
    email: $contactInfo,
    pin: $pinCode,
    is_admin: admin,
    is_active: activeUser,
  };

  try {
    const response = await fetch(`${API}users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });
    if (response.ok) {
      const data = await fetchData(getCurrentEndpoint());

      hideEditFields($article, updatedUser);
      $article.classList.remove("editing");

      createUserItems(data.allUsers);
      showNotification("User updated successfully!", "success");
    } else {
      console.error("Edit failed");
      showNotification("Error updating user.", "error");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

function initFormHandlers() {
  const $createUserForm = document.getElementById("addUserForm");

  if (!$createUserForm) {
    console.warn("Create user form not found, form functionality may not work");
    return;
  }
  // Handle form submission
  $createUserForm.addEventListener("submit", function (event) {
    event.preventDefault();
    createNewUser($createUserForm);
  });
}

async function createNewUser($createUserForm) {
  const $firstName = $createUserForm.querySelector("#form-first-name").value;
  const $lastName = $createUserForm.querySelector("#form-last-name").value;
  const $contactInfo = $createUserForm.querySelector("#form-contact-info").value;
  const $isActive = $createUserForm.querySelector("#form-is-active").value;
  const $pinCode = $createUserForm.querySelector("#form-pin-info").value;
  const $isAdmin = $createUserForm.querySelector("#form-is-admin").value;

  let activeUser = $isActive.toLowerCase() === "yes" ? 1 : 0;
  let admin = $isAdmin.toLowerCase() === "yes" ? 1 : 0;

  const newUser = {
    firstname: $firstName,
    lastname: $lastName,
    email: $contactInfo,
    pin: $pinCode,
    is_admin: admin,
    is_active: activeUser,
  };

  try {
    const response = await fetch(`${API}users`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await fetchData(getCurrentEndpoint());

      const $modal = document.querySelector('dialog[data-modal="add-user"]');
      if ($modal) {
        $modal.close();
      }

      $createUserForm.reset();
      createUserItems(data.allUsers);
      showNotification("User added successfully!", "success");
    } else {
      console.error("Creating new user failed");
      showNotification("Error adding user.", "error");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
}
