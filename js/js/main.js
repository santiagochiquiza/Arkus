const ctx = UI.canvas.getContext("2d");

let animationId = null;
let isRunning = false;
let elapsed = 0;

let params = null;
let linearParams = null;
let quadraticParams = null;

let impactTime = 0;
let impactTimeLinear = 0;
let impactTimeQuadratic = 0;

let currentState = null;
let currentLinearState = null;
let currentQuadraticState = null;

function buildModelParams(baseParams, modelType) {
  return {
    ...baseParams,
    modelType
  };
}

function getSelectedModelState(t) {
  if (params.modelType === "lineal") {
    return getStateAtTime(t, linearParams);
  }
  return getStateAtTime(t, quadraticParams);
}

function drawBackground(scenario, canvasWidth, canvasHeight, floorY) {
  const gradient = ctx.createLinearGradient(0, 0, 0, floorY);
  gradient.addColorStop(0, scenario.skyTop);
  gradient.addColorStop(1, scenario.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, floorY);

  ctx.fillStyle = scenario.ground;
  ctx.fillRect(0, floorY, canvasWidth, canvasHeight - floorY);
}

function drawDropTower(centerX, topY, floorY) {
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.lineTo(centerX, floorY);
  ctx.stroke();

  ctx.fillStyle = "#334155";
  ctx.fillRect(centerX - 70, topY - 12, 140, 18);

  ctx.fillStyle = "#64748b";
  ctx.fillRect(centerX - 10, topY, 20, 24);
}

function drawLandingZone(centerX, floorY, landingWidthPx, scenario) {
  ctx.fillStyle = scenario.landing;
  ctx.fillRect(centerX - landingWidthPx / 2, floorY - 10, landingWidthPx, 10);

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - landingWidthPx / 2, floorY - 10, landingWidthPx, 10);

  ctx.fillStyle = "#111827";
  ctx.font = "14px Arial";
  ctx.fillText("Zona de caída", centerX - 45, floorY + 22);
}

function drawHeightMarkers(centerX, topY, floorY, height) {
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 4]);

  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const y = topY + ((floorY - topY) * i) / steps;
    ctx.beginPath();
    ctx.moveTo(centerX - 80, y);
    ctx.lineTo(centerX + 80, y);
    ctx.stroke();

    const value = (height - (height * i) / steps).toFixed(2);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`${value} m`, centerX + 90, y + 4);
  }

  ctx.setLineDash([]);
}

function drawObject(centerX, objectY, modelType) {
  ctx.beginPath();
  ctx.arc(centerX, objectY, 16, 0, Math.PI * 2);
  ctx.fillStyle = modelType === "lineal" ? "#2563eb" : "#dc2626";
  ctx.fill();
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawInfoPanel(state, params) {
  const scenario = getScenario(params.scenarioKey);
  const mediumLabel = scenario.mediumType === "fluid" ? "Fluido" : "Gas";

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(20, 20, 240, 120);

  ctx.strokeStyle = "#cbd5e1";
  ctx.strokeRect(20, 20, 240, 120);

  ctx.fillStyle = "#111827";
  ctx.font = "14px Arial";
  ctx.fillText(`Modelo: ${params.modelType === "lineal" ? "Lineal" : "Cuadrático"}`, 30, 45);
  ctx.fillText(`Medio: ${mediumLabel}`, 30, 68);
  ctx.fillText(`Tiempo: ${state.t.toFixed(3)} s`, 30, 91);
  ctx.fillText(`Posición: ${state.y.toFixed(3)} m`, 30, 114);
  ctx.fillText(`Velocidad: ${state.v.toFixed(3)} m/s`, 30, 137);
}

function drawScene(state, params) {
  const canvas = UI.canvas;
  const w = canvas.width;
  const h = canvas.height;

  const scenario = getScenario(params.scenarioKey);

  const topY = 60;
  const floorY = h - 70;
  const centerX = w / 2;
  const travelHeightPx = floorY - topY;

  const ratio = Math.min(state.y / params.height, 1);
  const objectY = topY + ratio * travelHeightPx;

  const landingWidthPx = Math.max(120, params.landingSize * 18);

  ctx.clearRect(0, 0, w, h);

  drawBackground(scenario, w, h, floorY);
  drawDropTower(centerX, topY, floorY);
  drawLandingZone(centerX, floorY, landingWidthPx, scenario);
  drawHeightMarkers(centerX, topY, floorY, params.height);
  drawObject(centerX, objectY, params.modelType);
  drawInfoPanel(state, params);

  ctx.fillStyle = "#111827";
  ctx.font = "16px Arial";
  ctx.fillText(`Escenario: ${scenario.name}`, 20, h - 25);
}

function resetSimulation() {
  cancelAnimationFrame(animationId);
  isRunning = false;
  elapsed = 0;

  params = getInputValues();

  linearParams = buildModelParams(params, "lineal");
  quadraticParams = buildModelParams(params, "cuadratico");

  impactTimeLinear = getImpactTime(linearParams);
  impactTimeQuadratic = getImpactTime(quadraticParams);
  impactTime = params.modelType === "lineal" ? impactTimeLinear : impactTimeQuadratic;

  currentLinearState = getStateAtTime(0, linearParams);
  currentQuadraticState = getStateAtTime(0, quadraticParams);
  currentState = getSelectedModelState(0);

  updateResults(currentState, params);
  updateExtendedResults(
    impactTimeLinear,
    impactTimeQuadratic,
    linearParams,
    quadraticParams,
    impactTime
  );

  setScenarioLabel();
  setStatus("Simulación reiniciada.");
  resetCharts();

  if (params.compareModels === "si") {
    addComparisonPoints(currentLinearState, currentQuadraticState);
  } else {
    addSingleModelPoints(currentState, params.modelType);
  }

  drawScene(currentState, params);
}

function animate() {
  if (!isRunning) return;

  elapsed += 0.016;

  currentLinearState = getStateAtTime(Math.min(elapsed, impactTimeLinear), linearParams);
  currentQuadraticState = getStateAtTime(Math.min(elapsed, impactTimeQuadratic), quadraticParams);
  currentState = getSelectedModelState(Math.min(elapsed, impactTime));

  updateResults(currentState, params);
  updateExtendedResults(
    impactTimeLinear,
    impactTimeQuadratic,
    linearParams,
    quadraticParams,
    impactTime
  );

  if (params.compareModels === "si") {
    addComparisonPoints(currentLinearState, currentQuadraticState);
  } else {
    addSingleModelPoints(currentState, params.modelType);
  }

  drawScene(currentState, params);

  const finishedSelected =
    (params.modelType === "lineal" && elapsed >= impactTimeLinear) ||
    (params.modelType === "cuadratico" && elapsed >= impactTimeQuadratic);

  if (finishedSelected) {
    isRunning = false;
    setStatus("El objeto llegó a la zona de caída.");
    return;
  }

  animationId = requestAnimationFrame(animate);
}

function startSimulation() {
  if (isRunning) return;
  params = getInputValues();
  isRunning = true;
  setStatus("Simulación en curso...");
  animate();
}

function pauseSimulation() {
  isRunning = false;
  cancelAnimationFrame(animationId);
  setStatus("Simulación pausada.");
}

function setupEvents() {
  [
    UI.massRange,
    UI.massNumber,
    UI.gravityRange,
    UI.gravityNumber,
    UI.dragRange,
    UI.dragNumber,
    UI.heightRange,
    UI.heightNumber,
    UI.landingRange,
    UI.landingNumber
  ].forEach(input => {
    input.addEventListener("input", () => {
      if (!isRunning) resetSimulation();
    });
  });

  UI.modelType.addEventListener("change", () => {
    if (!isRunning) resetSimulation();
  });

  UI.compareModels.addEventListener("change", () => {
    if (!isRunning) resetSimulation();
  });

  UI.scenarioSelect.addEventListener("change", () => {
    applyScenario();
    if (!isRunning) resetSimulation();
  });

  UI.startBtn.addEventListener("click", startSimulation);
  UI.pauseBtn.addEventListener("click", pauseSimulation);
  UI.resetBtn.addEventListener("click", resetSimulation);
}

function initApp() {
  initCharts();
  setupInputSync();
  updateDisplayedValues();
  applyScenario();
  setupEvents();
  resetSimulation();
}

window.addEventListener("load", initApp);