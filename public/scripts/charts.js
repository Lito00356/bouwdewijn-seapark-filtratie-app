import Chart from "https://cdn.jsdelivr.net/npm/chart.js@4.4.9/auto/+esm";

const $canvas = document.getElementById("myChart");
const $valueSelector = document.getElementById("value-selector");
const $viewSelector = document.getElementById("view-selector");
const $statsModal = document.getElementById("statistics-modal");

// let myChart = new Chart($canvas, {
//   type: "line",
//   data: {
//     labels: ["Mon", "09:00AM", "12:00AM", "15:00PM", "18:00PM", "21:00PM", "Tue", "09:00AM", "12:00AM", "15:00PM", "18:00PM", "21:00PM", "Wed", "09:00AM", "12:00AM", "15:00PM", "18:00PM", "21:00PM", "Thu", "09:00AM", "12:00AM", "15:00PM", "18:00PM", "21:00PM", "Fri", "09:00AM", "12:00AM", "15:00PM", "18:00PM", "21:00PM"],
//     datasets: [
//       {
//         label: "Choose a value",
//         data: [],
//         borderWidth: 1,
//         borderColor: "rgb(122, 132, 223)",
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: false,
//       },
//     },
//   },
// });

let myChart = new Chart($canvas, {
  type: "line",
  data: {
    labels: ["Mon", "09:00AM", "12:00PM", "15:00PM", "18:00PM", "21:00PM", "Tue", "09:00AM", "12:00PM", "15:00PM", "18:00PM", "21:00PM", "Wed", "09:00AM", "12:00PM", "15:00PM", "18:00PM", "21:00PM", "Thu", "09:00AM", "12:00PM", "15:00PM", "18:00PM", "21:00PM", "Fri", "09:00AM", "12:00PM", "15:00PM", "18:00PM", "21:00PM"],
    datasets: [
      {
        label: "Choose a value",
        data: new Array(30).fill(null),
        borderWidth: 1,
        borderColor: "rgb(122, 132, 223)",
        spanGaps: true,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  },
});

// fucntion to add data at specific times need to revisit this section!
function addDataPoint(day, time, value) {
  const dayIndex = {
    Mon: 0,
    Tue: 6,
    Wed: 12,
    Thu: 18,
    Fri: 24,
  };

  const timeIndex = {
    "09:00AM": 1,
    "12:00PM": 2,
    "15:00PM": 3,
    "18:00PM": 4,
    "21:00PM": 5,
  };

  const index = dayIndex[day] + timeIndex[time];
  myChart.data.datasets[0].data[index] = value;
  myChart.update();
}

addDataPoint("Mon", "12:00PM", 25);
addDataPoint("Wed", "15:00PM", 18);
addDataPoint("Fri", "09:00AM", 32);

const lineChartData = {
  value: {
    labels: ["choose a value"],
    data: [1],
  },
  ph: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [7.2, 7.4, 7.1, 7.3, 7.5, 7.2, 7.4],
  },
  h2o: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [85, 88, 82, 90, 87, 89, 86],
  },
  temperature: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [22, 25, 23, 26, 24, 27, 25],
  },
};

function updateChart() {
  const $newValueSelector = document.getElementById("value-selector");
  const $selectedValue = $newValueSelector.value;

  const $selectedData = lineChartData[$selectedValue];

  myChart.data.labels = $selectedData.labels;
  myChart.data.datasets[0].data = $selectedData.data;
  myChart.data.datasets[0].label = $selectedValue.toUpperCase();
  myChart.update("active");
}

function updateViewType() {
  const $newViewSelector = document.getElementById("view-selector");
  const $selectedValue = $newViewSelector.value;

  if ($selectedValue === "graph") {
    $statsModal.innerHTML = `
    <div class="statistics__info-menus">
      
      <div class="statistics__info-selectors">
        <label>
          <select name="value-selection" id="value-selector">
            <option value="value">Value</option>
            <option value="ph">ph</option>
            <option value="h2o">h2o</option>
            <option value="temperature">temperature</option>
          </select>
        </label>
        <label>
          <select name="frequency" id="">
            <option value="weekly" selected>Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label>
          <select name="type" id="view-selector">
            <option value="graph" selected>Graph</option>
            <option value="table">Table</option>
          </select>
        </label>
      </div>
    </div>
    <div class="graph" id="graph-container">
      <canvas id="myChart"></canvas>
    </div>
`;
    initEventListenerOnChange();
  } else if ($selectedValue === "table") {
    $statsModal.innerHTML = `
    <div class="statistics__info-menus statistics__info-menus--table">
      <div class="statistics__info-selectors">
        <label>
          <select name="frequency" id="">
            <option value="weekly" selected>Weekly</option>
            <option value="monthyl">Monthly</option>
          </select>
        </label>
        <label>
          <select name="type" id="view-selector">
            <option value="graph">Graph</option>
            <option value="table" selected>Table</option>
          </select>
        </label>
      </div>
    </div>
    <div class="table">
      <div class="table__titles">
        <strong>Value</strong>
        <strong class="table__values-justifyE">Ref. value</strong>
        <strong class="table__values-justifyE">Unit</strong>
        <strong class="table__values-justifyE">Measured value</strong>
        <strong class="table__values-justifyE">Unit</strong>
      </div>
      <div class="table__values">
        <div class="table__values-item">
          <span>Chloor</span>
          <span class="table__values-justifyE">1.1 - 2.2</span>
          <span class="table__values-justifyE">mg/L</span>
          <span class="table__values-justifyE">1.5</span>
          <span class="table__values-justifyE">mg/L</span>
        </div>
        <div class="table__values-item">
          <span>PH</span>
          <span class="table__values-justifyE">7.5 - 8.9</span>
          <span class="table__values-justifyE">mg/L</span>
          <span class="table__values-justifyE">8.2</span>
          <span class="table__values-justifyE">mg/L</span>
        </div>
        <div class="table__values-item">
          <span>Temperatuur</span>
          <span class="table__values-justifyE">24 - 26</span>
          <span class="table__values-justifyE">°C</span>
          <span class="table__values-justifyE">25</span>
          <span class="table__values-justifyE">°C</span>
        </div>
        <div class="table__values-item">
          <span>Zoutgehalte</span>
          <span class="table__values-justifyE">28.3 - 34.8</span>
          <span class="table__values-justifyE">mg/L</span>
          <span class="table__values-justifyE">32</span>
          <span class="table__values-justifyE">mg/L</span>
        </div>
        <div class="table__values-item">
          <span>Ammoniak</span>
          <span class="table__values-justifyE">2.1 - 4.2</span>
          <span class="table__values-justifyE">mg/L</span>
          <span class="table__values-justifyE">5</span>
          <span class="table__values-justifyE">mg/L</span>
        </div>
      </div>
  `;
    initEventListenerOnChange();
  }
}

function initEventListenerOnChange() {
  const $newValueSelector = document.getElementById("value-selector");
  const $newViewSelector = document.getElementById("view-selector");

  if ($newValueSelector) {
    $newValueSelector.addEventListener("change", updateChart);
  }
  if ($newViewSelector) {
    $newViewSelector.addEventListener("change", updateViewType);
  }

  const $newCanvas = document.getElementById("myChart");
  if ($newCanvas) {
    if (myChart) {
      myChart.destroy();
    }
  }

  setTimeout(() => {
    const $canvas = document.getElementById("myChart");
    if ($canvas) {
      myChart = new Chart($canvas, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Choose a value",
              data: [],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
      updateChart();
    }
  }, 10);
}

$valueSelector.addEventListener("change", updateChart);
$viewSelector.addEventListener("change", updateViewType);
