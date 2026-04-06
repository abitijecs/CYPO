// EU Regulation EC No 561/2006
const MAX_CONTINUOUS_DRIVING = 4.5 * 3600; // 4h30 in seconds
const BREAK_DURATION = 45 * 60;            // 45 min
const MAX_DAILY_DRIVING = 9 * 3600;        // 9h
const DAILY_REST_DURATION = 11 * 3600;     // 11h

function safe(matrix, i, j) {
  const v = matrix[i]?.[j];
  return v == null ? Infinity : v;
}

function nearestNeighbor(durations, n) {
  const visited = new Set([0]);
  const order = [0];
  let current = 0;
  while (order.length < n) {
    let best = -1;
    let bestCost = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && safe(durations, current, i) < bestCost) {
        bestCost = safe(durations, current, i);
        best = i;
      }
    }
    visited.add(best);
    order.push(best);
    current = best;
  }
  return order;
}

function twoOpt(order, durations) {
  let best = [...order];
  const n = best.length;
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const edge1 = safe(durations, best[i - 1], best[i]);
        const edge2 = j + 1 < n ? safe(durations, best[j], best[j + 1]) : 0;
        const newEdge1 = safe(durations, best[i - 1], best[j]);
        const newEdge2 = j + 1 < n ? safe(durations, best[i], best[j + 1]) : 0;
        if (newEdge1 + newEdge2 < edge1 + edge2 - 0.01) {
          best = [
            ...best.slice(0, i),
            ...best.slice(i, j + 1).reverse(),
            ...best.slice(j + 1)
          ];
          improved = true;
        }
      }
    }
  }
  return best;
}

function calculateBreaks(order, durations) {
  const breaks = [];
  let continuous = 0;
  let daily = 0;

  for (let i = 0; i < order.length - 1; i++) {
    let remaining = safe(durations, order[i], order[i + 1]);
    if (remaining === Infinity) continue;

    while (remaining > 0) {
      const canDrive = Math.min(
        remaining,
        MAX_CONTINUOUS_DRIVING - continuous,
        MAX_DAILY_DRIVING - daily
      );
      continuous += canDrive;
      daily += canDrive;
      remaining -= canDrive;

      if (remaining > 0) {
        if (daily >= MAX_DAILY_DRIVING) {
          breaks.push({ afterLeg: i, type: 'daily_rest', duration: DAILY_REST_DURATION });
          continuous = 0;
          daily = 0;
        } else {
          breaks.push({ afterLeg: i, type: 'break', duration: BREAK_DURATION });
          continuous = 0;
        }
      }
    }
  }
  return breaks;
}

export function optimize(stops, matrix) {
  const { durations, distances } = matrix;
  const n = stops.length;

  if (n <= 1) return { order: [0], breaks: [], totalDistance: 0, totalDuration: 0 };

  let order;
  if (n === 2) {
    order = [0, 1];
  } else {
    order = nearestNeighbor(durations, n);
    order = twoOpt(order, durations);
  }

  let totalDistance = 0;
  let totalDuration = 0;
  for (let i = 0; i < order.length - 1; i++) {
    totalDistance += safe(distances, order[i], order[i + 1]);
    totalDuration += safe(durations, order[i], order[i + 1]);
  }

  const breaks = calculateBreaks(order, durations);
  return { order, breaks, totalDistance, totalDuration };
}
