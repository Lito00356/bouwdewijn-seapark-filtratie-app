if (window.location.pathname.includes("statistics")) {
  const $departmentSelect = document.getElementById("department-select");
  const $subdepartmentSelect = document.getElementById("subdepartment-select");
  const $parameterSelect = document.getElementById("parameter-select");
  const $startDateInput = document.getElementById("start-date");
  const $endDateInput = document.getElementById("end-date");
  const $applyFiltersBtn = document.getElementById("apply-filters-btn");
  const $loadingIndicator = document.getElementById("loading-indicator");
  const $resultsContainer = document.getElementById("results-container");
  const $exportBtn = document.getElementById("export-data");
  const departments = window.departmentsData || [];
  const measurementDefinitions = window.measurementDefinitionsData || [];

  init();

  async function init() {
    try {
      updateSubDepartments();
      initializeParameterSelect();

      const urlParams = new URLSearchParams(window.location.search);
      const selectedDepartmentId = urlParams.get("department");
      const selectedSubDepartmentId = urlParams.get("subdepartment");

      if (selectedDepartmentId) {
        $departmentSelect.value = selectedDepartmentId;
        updateSubDepartments();

        if (selectedSubDepartmentId) {
          $subdepartmentSelect.value = selectedSubDepartmentId;
        }
        await fetchMeasurementData();
      }
    } catch (error) {
      console.error("Error initializing page:", error);
      showError("Failed to load page data");
    }
  }

  function initializeParameterSelect() {
    $parameterSelect.innerHTML = '<option value="all">All Parameters</option>';

    measurementDefinitions.forEach((definition) => {
      const option = document.createElement("option");
      option.value = definition.measurement_key;
      option.textContent = definition.name;
      $parameterSelect.appendChild(option);
    });
  }

  function updateSubDepartments() {
    const selectedDeptId = parseInt($departmentSelect.value);
    const selectedDept = departments.find(
      (department) => department.id === selectedDeptId
    );

    $subdepartmentSelect.innerHTML =
      '<option value="">All Sub-departments</option>';

    if (selectedDept && selectedDept.sub_departments) {
      selectedDept.sub_departments.forEach((subDept) => {
        const option = document.createElement("option");
        option.value = subDept.id;
        option.textContent = subDept.name;
        $subdepartmentSelect.appendChild(option);
      });
    }
  }

  async function fetchMeasurementData() {
    try {
      showLoading(true);

      const params = new URLSearchParams();

      if ($departmentSelect.value)
        params.append("department", $departmentSelect.value);
      if ($subdepartmentSelect.value)
        params.append("subdepartment", $subdepartmentSelect.value);
      if ($startDateInput.value)
        params.append("startDate", $startDateInput.value);
      if ($endDateInput.value) params.append("endDate", $endDateInput.value);
      if ($parameterSelect.value && $parameterSelect.value !== "all") {
        params.append("parameter", $parameterSelect.value);
      }

      const response = await fetch(
        `/api/measurement_logs?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      renderMeasurementsTable(data || []);

      $exportBtn.disabled = false;
    } catch (error) {
      console.error("Error fetching measurement data:", error);
      showError("Failed to load measurement data. Please try again.");
    } finally {
      showLoading(false);
    }
  }

  function renderMeasurementsTable(measurements) {
    if (!measurements || measurements.length === 0) {
      $resultsContainer.innerHTML = `
        <div class="no-results">
          <p>No measurement data found for the selected filters.</p>
          <p>Try adjusting your date range or department selection.</p>
        </div>
      `;
      return;
    }

    const selectedParameter = $parameterSelect.value;

    let html = `
      <div class="results-summary">
        <p>Showing ${measurements.length} measurements</p>
      </div>
      <div class="table-container">
        <h3 class="table-container__title">Statistics Results</h3>
        <table class="statistics-table">
          <thead class="statistics-table__header">
            <tr>
              <th>Date & Time</th>
              <th>Department</th>
              <th>Sub-department</th>
              <th>Recorded By</th>
              <th>Measurements</th>
            </tr>
          </thead>
          <tbody>
    `;

    measurements.forEach((log) => {
      const measurements = log.measurements || {};
      const filteredMeasurements =
        selectedParameter === "all"
          ? measurements
          : { [selectedParameter]: measurements[selectedParameter] };

      const userName =
        log.users?.firstname && log.users?.lastname
          ? `${log.users.firstname} ${log.users.lastname}`
          : "Unknown User";

      html += `
        <tr>
          <td>${log.measured_at || "N/A"}</td>
          <td>${log.sub_departments?.department?.name || "Unknown"}</td>
          <td>${log.sub_departments?.name || "Unknown"}</td>
          <td>${userName}</td>
          <td class="statistics-measurements-cell">
            ${Object.entries(filteredMeasurements)
              .map(([param, value]) => {
                const definition = measurementDefinitions.find(
                  (def) => def.measurement_key === param
                );
                return formatMeasurementWithRange(param, value, definition);
              })
              .join("")}
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    $resultsContainer.innerHTML = html;
  }

  function showLoading(show) {
    $loadingIndicator.style.display = show ? "block" : "none";
    $applyFiltersBtn.disabled = show;
  }

  function formatMeasurementWithRange(param, value, definition) {
    const displayName = definition ? definition.name : param;

    if (value === null || value === undefined) {
      return `<div class="statistics-measurement-item statistics-measurement-missing">
      <strong>${displayName}:</strong> 
      <span class="missing-data">No data recorded</span>
    </div>`;
    }

    let measurementHtml = `<div class="statistics-measurement-item"><strong>${displayName}:</strong> ${value}`;

    if (definition) {
      const hasMin = definition.min_value !== null;
      const hasMax = definition.max_value !== null;

      if (hasMin || hasMax) {
        let rangeText = "";
        let statusIcon = "";

        if (hasMin && hasMax) {
          rangeText = `(${definition.min_value} - ${definition.max_value})`;
        } else if (hasMin) {
          rangeText = `(Min: ${definition.min_value})`;
        } else if (hasMax) {
          rangeText = `(Max: ${definition.max_value})`;
        }

        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          const isAboveMin = !hasMin || numValue >= definition.min_value;
          const isBelowMax = !hasMax || numValue <= definition.max_value;
          const isWithinRange = isAboveMin && isBelowMax;

          statusIcon = isWithinRange ? "" : " ⚠️";
        }

        measurementHtml += ` <span class="statistics-range">${rangeText}${statusIcon}</span>`;
      }
    }

    measurementHtml += `</div>`;
    return measurementHtml;
  }

  function showError(message) {
    $resultsContainer.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
  }

  $departmentSelect.addEventListener("change", updateSubDepartments);
  $applyFiltersBtn.addEventListener("click", fetchMeasurementData);
  $exportBtn.addEventListener("click", exportData);

  async function exportData() {
    try {
      $exportBtn.disabled = true;
      $exportBtn.textContent = "Exporting...";

      const params = new URLSearchParams();
      if ($departmentSelect.value)
        params.append("department", $departmentSelect.value);
      if ($subdepartmentSelect.value)
        params.append("subdepartment", $subdepartmentSelect.value);
      if ($startDateInput.value)
        params.append("startDate", $startDateInput.value);
      if ($endDateInput.value) params.append("endDate", $endDateInput.value);
      if ($parameterSelect.value !== "all")
        params.append("parameter", $parameterSelect.value);

      const response = await fetch(
        `/api/measurement_logs?${params.toString()}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const measurements = await response.json();
      if (!measurements.length) return alert("No data to export");

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Seapark LSS";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Measurements");

      worksheet.addRow([`Export Date: ${new Date().toLocaleString()}`]);
      worksheet.addRow([`Total Records: ${measurements.length}`]);
      if ($startDateInput.value || $endDateInput.value) {
        const startDate = $startDateInput.value
          ? new Date($startDateInput.value).toLocaleDateString()
          : "All";
        const endDate = $endDateInput.value
          ? new Date($endDateInput.value).toLocaleDateString()
          : "All";

        worksheet.addRow([`Date Range: ${startDate} to ${endDate}`]);
      }
      worksheet.addRow([]);

      const headerRow = worksheet.addRow([
        "Date & Time",
        "Department",
        "Sub-department",
        "Recorded By",
        "Measurements",
        "Status",
      ]);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
      });

      measurements.forEach((log) => {
        const measurementLines = Object.entries(log.measurements || {})
          .filter((value) => value !== null && value !== undefined)
          .map(([key, value]) => {
            const def = measurementDefinitions.find(
              (d) => d.measurement_key === key
            );
            return `${def?.name || key}: ${value}`;
          });

        const alertLines = Object.entries(log.measurements || {})
          .filter(([key, value]) => {
            if (value === null || value === undefined) return false;
            const def = measurementDefinitions.find(
              (d) => d.measurement_key === key
            );
            const num = parseFloat(value);
            return (
              def &&
              !isNaN(num) &&
              ((def.min_value !== null && num < def.min_value) ||
                (def.max_value !== null && num > def.max_value))
            );
          })
          .map(([key, value]) => {
            const def = measurementDefinitions.find(
              (d) => d.measurement_key === key
            );
            const num = parseFloat(value);
            return num < def.min_value
              ? `${def.name}: Below Min`
              : `${def.name}: Above Max`;
          });

        const userName =
          log.users?.firstname && log.users?.lastname
            ? `${log.users.firstname} ${log.users.lastname}`
            : "Unknown User";

        const row = worksheet.addRow([
          log.measured_at || "N/A",
          log.sub_departments?.department?.name || "Unknown",
          log.sub_departments?.name || "Unknown",
          userName,
          measurementLines.join("\n"),
          alertLines.length > 0 ? alertLines.join("\n") : "All OK",
        ]);

        row.eachCell((cell) => {
          cell.alignment = { vertical: "top", wrapText: true };
        });
      });

      worksheet.columns.forEach((column) => {
        column.width = 30;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), {
        href: url,
        download: `measurements-${new Date()
          .toLocaleDateString()
          .replace(/\//g, "-")}.xlsx`,
        style: "display: none",
      });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      $exportBtn.disabled = false;
      $exportBtn.textContent = "Export to Excel";
    }
  }
}
