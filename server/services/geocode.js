const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const HEADERS = {
  'User-Agent': 'TruckRouteOptimizer/1.0 (opensource@example.com)',
  'Accept-Language': 'fr,en'
};

export async function geocode(query) {
  const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=fr,be,ch,lu,de,es,it`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  return res.json();
}

export async function reverseGeocode(lat, lon) {
  const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Nominatim reverse error: ${res.status}`);
  const data = await res.json();
  const addr = data.address || {};
  const name = addr.city || addr.town || addr.village || addr.municipality || addr.hamlet || data.name || `${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)}`;
  return { name, display_name: data.display_name, lat, lon };
}
