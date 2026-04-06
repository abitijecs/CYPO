import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

function pinIcon(label, color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:30px;height:36px;
      display:flex;align-items:center;justify-content:center;
      flex-direction:column;">
      <div style="
        width:28px;height:28px;
        background:${color};
        border:2.5px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(0,0,0,.35);
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);color:white;font-size:11px;font-weight:700;line-height:1;">${label}</span>
      </div>
    </div>`,
    iconSize: [30, 36],
    iconAnchor: [15, 34],
    popupAnchor: [0, -34]
  });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else if (positions.length === 1) {
      map.setView(positions[0], 12);
    }
  }, [JSON.stringify(positions)]);
  return null;
}

function ClickHandler({ onAddStop, enabled }) {
  useMapEvents({
    click: async (e) => {
      if (!enabled) return;
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lng}`);
        const data = await res.json();
        onAddStop({ name: data.name, address: data.display_name, lat, lon: lng });
      } catch {
        onAddStop({
          name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          lat, lon: lng
        });
      }
    }
  });
  return null;
}

export default function MapView({ stops, result, onAddStop, mapClickMode }) {
  const displayStops = result ? result.stops : stops;
  const routeCoords = result?.geometry?.coordinates?.map(([lon, lat]) => [lat, lon]);

  const markerColor = (i, total) => {
    if (i === 0) return '#f97316';
    if (i === total - 1) return '#22c55e';
    return '#1a365d';
  };

  const positions = displayStops.map(s => [s.lat, s.lon]);

  return (
    <MapContainer center={[46.5, 2.3]} zoom={6} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <FitBounds positions={positions} />
      <ClickHandler onAddStop={onAddStop} enabled={mapClickMode} />

      {displayStops.map((stop, i) => (
        <Marker
          key={stop.id || i}
          position={[stop.lat, stop.lon]}
          icon={pinIcon(i === 0 ? '⚑' : i, markerColor(i, displayStops.length))}
        >
          <Popup>
            <strong>{stop.name}</strong>
            {stop.address && stop.address !== stop.name && (
              <><br /><small style={{ color: '#64748b' }}>{stop.address.split(',').slice(0, 3).join(',')}</small></>
            )}
          </Popup>
        </Marker>
      ))}

      {routeCoords && routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{ color: '#f97316', weight: 5, opacity: 0.85 }}
        />
      )}
    </MapContainer>
  );
}
