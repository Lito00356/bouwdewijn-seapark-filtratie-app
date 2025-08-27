import { fetchData } from "./services/fetch.js";
import { initDepartmentSync } from "./utils/systems/departmentSync.js";
import { initSubdepartmentSync } from "./utils/systems/subdepartmentSync.js";

if (window.location.pathname.includes("history")) {
  const $frequencySelect = document.getElementById("frequency-select");
  const $dateHighlight = document.getElementById("date-highlight");
  let $frequencyDisplay = document.getElementById("frequencyDisplay");
  const $calendar = document.getElementById("calendar-selection");
  let $logsContainer = document.getElementById("logs-container");

  let dateOnLoad = formatDateTime();

  initDepartmentSync();
  initSubdepartmentSync();
  if ($dateHighlight) {
    $dateHighlight.innerHTML = dateOnLoad;
  }

  (async () => {
    const allTaskLogs = await fetchData("task_logs");
    const allActions = await fetchData("actions");
    const users = await fetchData("users");
    const allUsers = users.allUsers;

    let savedDate = $calendar?.value || "";
    let savedDepFilterVal = "All departments";
    let frequency = "all";

    function allTaskHistory(calenderDate) {
      $logsContainer.innerHTML = "";

      allTaskLogs.forEach((entry) => {
        const matchingAction = allActions.find(
          (action) => action.id === entry.action_id
        );
        const matchingUser = allUsers.find((user) => user.id === entry.user_id);
        const performedDate = entry.performed_at.substring(0, 8);

        if (!calenderDate) {
          if (performedDate === dateOnLoad)
            completeIncompleteHTML(
              matchingAction,
              entry,
              performedDate,
              matchingUser
            );
        } else {
          if (performedDate === calenderDate)
            completeIncompleteHTML(
              matchingAction,
              entry,
              performedDate,
              matchingUser
            );
        }
      });
    }

    function reformatCalenderValue(value) {
      if (!value || value.trim() === "") {
        return dateOnLoad;
      }
      const splitValue = value.split("-");

      const day = splitValue[2];
      const month = splitValue[1];
      const year = splitValue[0].slice(-2);
      const reformattedDate = `${day}/${month}/${year}`;
      return reformattedDate;
    }

    function filterFrequency(frequency) {
      $logsContainer.innerHTML = "";

      if (frequency === "extra") {
        frequency = "as_needed";
      }

      if (savedDate == "") {
        savedDate = dateOnLoad;
      }

      updateFilterTextDisplay(frequency, savedDate, savedDepFilterVal);

      allTaskLogs.forEach((entry) => {
        const matchingAction = allActions.find(
          (action) => action.id === entry.action_id
        );
        const matchingFrequency = allActions.find(
          (action) => action.id === entry.action_id
        );
        const matchingUser = allUsers.find((user) => user.id === entry.user_id);
        const performedDate = entry.performed_at.substring(0, 8);

        if (frequency === "all" && performedDate == savedDate) {
          completeIncompleteHTML(
            matchingAction,
            entry,
            performedDate,
            matchingUser
          );
        }

        if (
          matchingFrequency.frequency === frequency &&
          performedDate == savedDate
        ) {
          if (entry.is_complete) {
            $logsContainer.innerHTML += `
              <article class="log-item">
                  <span class="log-name">${matchingFrequency.name}</span>
                  <span class="log-system">${entry.object_name}</span>
                  <span class="log-completion">${performedDate}</span>
                  <span class="log-person">${matchingUser.firstname} ${matchingUser.lastname}</span>
                  <span class="log-status log-status--table complete">Complete</span>
                  <span class="log-error">
                  </span>
              </article>
          `;
          } else if (entry.comment_type === "error" || "observation") {
            $logsContainer.innerHTML += `
              <article class="log-item">
                  <span class="log-name">${matchingFrequency.name}</span>
                  <span class="log-system">${entry.object_name}</span>
                  <span class="log-completion">${performedDate}</span>
                  <span class="log-person">${matchingUser.firstname} ${matchingUser.lastname}</span>
                  <span class="log-status log-status--table error">Incomplete</span>
                  <span class="log-error">
                    <svg class="icon icon--base">
                      <use href="/assets/icons/sprite.svg#warning-icon"></use>
                    </svg>
                  </span>
              </article>
          `;
          }
        }
      });
    }

    function updateFilterTextDisplay(frequency, date) {
      $frequencyDisplay.innerHTML = "";

      if (frequency === "as_needed") {
        frequency = "Extra";
      } else if (date === reformatCalenderValue(date)) {
        date = "Today";
      }

      let upperCaseFreq =
        String(frequency).charAt(0).toUpperCase() + String(frequency).slice(1);

      if (frequency === "monthly" || frequency === "weekly") {
        $frequencyDisplay.innerHTML = `
    Task history - <span>${upperCaseFreq}
    `;
      } else if (frequency === "all") {
        $frequencyDisplay.innerHTML = `
      Task history - <span>All tasks/actions </span>
      `;
      } else {
        $frequencyDisplay.innerHTML = `
      Task history - <span>${upperCaseFreq} </span>
      `;
      }
    }

    function completeIncompleteHTML(action, entry, date, user) {
      if (entry.is_complete) {
        $logsContainer.innerHTML += `
            <article class="log-item">
                <span class="log-name">${action.name}</span>
                <span class="log-system">${entry.object_name}</span>
                <span class="log-completion">${date}</span>
                <span class="log-person">${user.firstname} ${user.lastname}</span>
                <span class="log-status log-status--table complete">Complete</span>
                <span class="log-error">
                </span>
            </article>
        `;
      } else if (entry.comment_type === "error" || "observation") {
        $logsContainer.innerHTML += `
            <article class="log-item">
                <span class="log-name">${action.name}</span>
                <span class="log-system">${entry.object_name}</span>
                <span class="log-completion">${date}</span>
                <span class="log-person">${user.firstname} ${user.lastname}</span>
                <span class="log-status log-status--table error">Incomplete</span>
                <span class="log-error">
                  <svg class="icon icon--base">
                    <use href="/assets/icons/sprite.svg#warning-icon"></use>
                  </svg>
                </span>
            </article>
        `;
      }
    }

    allTaskHistory();

    if ($calendar) {
      $calendar.addEventListener("change", function () {
        if ($calendar.value) {
          savedDate = reformatCalenderValue($calendar.value);
        } else {
          savedDate = dateOnLoad;
        }

        if ($dateHighlight) {
          $dateHighlight.innerHTML = savedDate;
        }
        updateFilterTextDisplay(frequency, savedDate);
        filterFrequency(frequency);
      });
    }

    if ($frequencySelect) {
      $frequencySelect.addEventListener("change", function () {
        frequency = $frequencySelect.value;
        if (frequency !== "daily") {
          frequency = frequency.toLowerCase();
        }
        filterFrequency(frequency);
      });
    }
  })();

  function formatDateTime() {
    const today = new Date();
    const yearToday = today.getFullYear();
    const lastTwoDigitYear = String(yearToday).slice(-2);
    const monthToday = String(today.getMonth() + 1).padStart(2, "0");
    const dayToday = String(today.getDate()).padStart(2, "0");

    return `${dayToday}/${monthToday}/${lastTwoDigitYear}`;
  }
}
