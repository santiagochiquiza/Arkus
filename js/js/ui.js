const UI = {
  scenarioSelect: document.getElementById("scenarioSelect"),
  modelType: document.getElementById("modelType"),
  compareModels: document.getElementById("compareModels"),

  massRange: document.getElementById("massRange"),
  massNumber: document.getElementById("massNumber"),

  gravityRange: document.getElementById("gravityRange"),
  gravityNumber: document.getElementById("gravityNumber"),

  dragRange: document.getElementById("dragRange"),
  dragNumber: document.getElementById("dragNumber"),

  heightRange: document.getElementById("heightRange"),
  heightNumber: document.getElementById("heightNumber"),

  landingRange: document.getElementById("landingRange"),
  landingNumber: document.getElementById("landingNumber"),

  massValue: document.getElementById("massValue"),
  gravityValue: document.getElementById("gravityValue"),
  dragValue: document.getElementById("dragValue"),
  heightValue: document.getElementById("heightValue"),
  landingValue: document.getElementById("landingValue"),

  scenarioValue: document.getElementById("scenarioValue"),
  modelValue: document.getElementById("modelValue"),
  timeValue: document.getElementById("timeValue"),
  yValue: document.getElementById("yValue"),
  vValue: document.getElementById("vValue"),
  terminalValue: document.getElementById("terminalValue"),
  percentValue: document.getElementById("percentValue"),
  impactTimeValue: document.getElementById("impactTimeValue"),
  impactLinearValue: document.getElementById("impactLinearValue"),
  impactQuadraticValue: document.getElementById("impactQuadraticValue"),
  vtLinearValue: document.getElementById("vtLinearValue"),
  vtQuadraticValue: document.getElementById("vtQuadraticValue"),

  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),

  statusMessage: document.getElementById("statusMessage"),
  canvas: document.getElementById("gameCanvas")
};

function syncPair(rangeEl, numberEl) {
  rangeEl.addEventListener("input", () => {
    numberEl.value = rangeEl.value;
    updateDisplayedValues();
  });

  numberEl.addEventListener("input", () => {
    let value = parseFloat(numberEl.value);

    if (isNaN(value)) return;

    const min = parseFloat(numberEl.min);
    const max = parseFloat(numberEl.max);

    if (value < min) value = min;
    if (value > max) value = max;

    rangeEl.value = value;
    numberEl.value = value;
    updateDisplayedValues();
  });
}

function getInputValues() {
  return {
    scenarioKey: UI.scenarioSelect.value,
    modelType: UI.modelType.value,
    compareModels: UI.compareModels.value,
    mass: parseFloat(UI.massNumber.value),
    gravity: parseFloat(UI.gravityNumber.value),
    drag: parseFloat(UI.dragNumber.value),
    height: parseFloat(UI.heightNumber.value),
    landingSize: parseFloat(UI.landingNumber.value)
  };
}

function updateDisplayedValues() {
  UI.massValue.textContent = UI.massNumber.value;
  UI.gravityValue.textContent = UI.gravityNumber.value;
  UI.dragValue.textContent = UI.dragNumber.value;
  UI.heightValue.textContent = UI.heightNumber.value;
  UI.landingValue.textContent = UI.landingNumber.value;
}

function setScenarioLabel() {
  const selected = UI.scenarioSelect.options[UI.scenarioSelect.selectedIndex];
  UI.scenarioValue.textContent = selected.text;
}

function applyScenario() {
  const scenario = getScenario(UI.scenarioSelect.value);

  UI.gravityRange.value = scenario.gravity;
  UI.gravityNumber.value = scenario.gravity;

  // k no cambia con el escenario

  if (scenario.mediumType === "fluid") {
    UI.modelType.value = "cuadratico";
  } else if (scenario.mediumType === "gas") {
    UI.modelType.value = "lineal";
  }

  updateDisplayedValues();
  setScenarioLabel();
}

function updateResults(state, params) {
  UI.modelValue.textContent = params.modelType === "lineal" ? "Lineal" : "Cuadrático";
  UI.timeValue.textContent = state.t.toFixed(3);
  UI.yValue.textContent = state.y.toFixed(4);
  UI.vValue.textContent = state.v.toFixed(4);
  UI.terminalValue.textContent = state.vt.toFixed(4);
  UI.percentValue.textContent = state.percent.toFixed(2);
}

function updateExtendedResults(impactTimeLinear, impactTimeQuadratic, linearParams, quadraticParams, selectedImpactTime) {
  UI.impactLinearValue.textContent = impactTimeLinear.toFixed(3);
  UI.impactQuadraticValue.textContent = impactTimeQuadratic.toFixed(3);
  UI.vtLinearValue.textContent = getTerminalVelocity(linearParams).toFixed(4);
  UI.vtQuadraticValue.textContent = getTerminalVelocity(quadraticParams).toFixed(4);
  UI.impactTimeValue.textContent = selectedImpactTime.toFixed(3);
}

function setStatus(message) {
  UI.statusMessage.textContent = message;
}

function setupInputSync() {
  syncPair(UI.massRange, UI.massNumber);
  syncPair(UI.gravityRange, UI.gravityNumber);
  syncPair(UI.dragRange, UI.dragNumber);
  syncPair(UI.heightRange, UI.heightNumber);
  syncPair(UI.landingRange, UI.landingNumber);
}