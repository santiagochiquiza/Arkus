function getTerminalVelocity(params) {
  if (params.modelType === "lineal") {
    return (params.mass * params.gravity) / params.drag;
  }
  return Math.sqrt((params.mass * params.gravity) / params.drag);
}

function velocityLinear(t, params) {
  const { mass, gravity, drag } = params;
  return (mass * gravity / drag) * (1 - Math.exp((-drag * t) / mass));
}

function positionLinear(t, params) {
  const { mass, gravity, drag } = params;
  return (mass * gravity / drag) * t
    - (mass * mass * gravity / (drag * drag)) * (1 - Math.exp((-drag * t) / mass));
}

function velocityQuadratic(t, params) {
  const vt = getTerminalVelocity(params);
  return vt * Math.tanh((params.gravity / vt) * t);
}

function positionQuadratic(t, params) {
  const vt = getTerminalVelocity(params);
  return (vt * vt / params.gravity) * Math.log(Math.cosh((params.gravity / vt) * t));
}

function getStateAtTime(t, params) {
  let y = 0;
  let v = 0;

  if (params.modelType === "lineal") {
    v = velocityLinear(t, params);
    y = positionLinear(t, params);
  } else {
    v = velocityQuadratic(t, params);
    y = positionQuadratic(t, params);
  }

  const vt = getTerminalVelocity(params);
  const percent = vt > 0 ? (v / vt) * 100 : 0;

  return {
    t,
    y,
    v,
    vt,
    percent
  };
}

function getImpactTime(params) {
  let low = 0;
  let high = 30;

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const yMid = getStateAtTime(mid, params).y;

    if (yMid < params.height) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}