let velocityChart;
let positionChart;
let percentChart;

function createComparisonChart(canvasId, xLabel, yLabel, label1, label2) {
  return new Chart(document.getElementById(canvasId), {
    type: "line",
    data: {
      datasets: [
        {
          label: label1,
          data: [],
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: label2,
          data: [],
          borderWidth: 2,
          tension: 0.2,
          borderDash: [8, 5]
        }
      ]
    },
    options: {
      animation: false,
      responsive: true,
      scales: {
        x: {
          type: "linear",
          title: {
            display: true,
            text: xLabel
          }
        },
        y: {
          title: {
            display: true,
            text: yLabel
          }
        }
      }
    }
  });
}

function initCharts() {
  velocityChart = createComparisonChart(
    "velocityChart",
    "t (s)",
    "v (m/s)",
    "Modelo lineal",
    "Modelo cuadrático"
  );

  positionChart = createComparisonChart(
    "positionChart",
    "t (s)",
    "y (m)",
    "Modelo lineal",
    "Modelo cuadrático"
  );

  percentChart = createComparisonChart(
    "percentChart",
    "t (s)",
    "% vₜ",
    "Modelo lineal",
    "Modelo cuadrático"
  );
}

function resetCharts() {
  [velocityChart, positionChart, percentChart].forEach(chart => {
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.update();
  });
}

function addComparisonPoints(linearState, quadraticState) {
  velocityChart.data.datasets[0].data.push({ x: linearState.t, y: linearState.v });
  velocityChart.data.datasets[1].data.push({ x: quadraticState.t, y: quadraticState.v });

  positionChart.data.datasets[0].data.push({ x: linearState.t, y: linearState.y });
  positionChart.data.datasets[1].data.push({ x: quadraticState.t, y: quadraticState.y });

  percentChart.data.datasets[0].data.push({ x: linearState.t, y: linearState.percent });
  percentChart.data.datasets[1].data.push({ x: quadraticState.t, y: quadraticState.percent });

  velocityChart.update("none");
  positionChart.update("none");
  percentChart.update("none");
}

function addSingleModelPoints(state, modelType) {
  const index = modelType === "lineal" ? 0 : 1;

  velocityChart.data.datasets[index].data.push({ x: state.t, y: state.v });
  positionChart.data.datasets[index].data.push({ x: state.t, y: state.y });
  percentChart.data.datasets[index].data.push({ x: state.t, y: state.percent });

  velocityChart.update("none");
  positionChart.update("none");
  percentChart.update("none");
}