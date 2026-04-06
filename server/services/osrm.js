const OSRM_BASE = 'https://router.project-osrm.org';
const HEADERS = { 'User-Agent': 'TruckRouteOptimizer/1.0' };

export async function getTable(coords) {
  const coordStr = coords.map(([lon, lat]) => `${lon},${lat}`).join(';');
  const url = `${OSRM_BASE}/table/v1/driving/${coordStr}?annotations=duration,distance`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`OSRM Table API: ${res.status}`);
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error(`OSRM: ${data.code} - ${data.message || ''}`);
  return { durations: data.durations, distances: data.distances };
}

export async function getRoute(coords) {
  const coordStr = coords.map(([lon, lat]) => `${lon},${lat}`).join(';');
  const url = `${OSRM_BASE}/route/v1/driving/${coordStr}?overview=full&geometries=geojson&steps=false`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`OSRM Route API: ${res.status}`);
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error(`OSRM: ${data.code} - ${data.message || ''}`);
  const route = data.routes[0];
  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry,
    legs: route.legs.map(leg => ({ distance: leg.distance, duration: leg.duration }))
  };
}
