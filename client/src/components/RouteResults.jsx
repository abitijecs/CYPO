import './RouteResults.css';

function fmtDist(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}
function fmtDur(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m.toString().padStart(2, '0')}`;
}

export default function RouteResults({ result, truck }) {
  const { stops, totalDistance, totalDuration, breaks, legs } = result;
  const obligatoryBreaks = (breaks || []).filter(b => b.type === 'break' || b.type === 'daily_rest');

  const fuelL = ((totalDistance / 1000) / 100 * truck.fuelConsumption).toFixed(1);
  const fuelEur = ((totalDistance / 1000) / 100 * truck.fuelConsumption * truck.fuelPrice).toFixed(2);
  const totalWithBreaks = totalDuration + obligatoryBreaks.reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="route-results">
      {/* KPI cards */}
      <div className="kpi-grid">
        <div className="kpi">
          <span className="kpi-icon">📏</span>
          <div>
            <div className="kpi-val">{fmtDist(totalDistance)}</div>
            <div className="kpi-lbl">Distance totale</div>
          </div>
        </div>
        <div className="kpi">
          <span className="kpi-icon">🚗</span>
          <div>
            <div className="kpi-val">{fmtDur(totalDuration)}</div>
            <div className="kpi-lbl">Conduite pure</div>
          </div>
        </div>
        <div className="kpi">
          <span className="kpi-icon">⏱️</span>
          <div>
            <div className="kpi-val">{fmtDur(totalWithBreaks)}</div>
            <div className="kpi-lbl">Durée totale (avec pauses)</div>
          </div>
        </div>
        <div className="kpi">
          <span className="kpi-icon">⛽</span>
          <div>
            <div className="kpi-val">{fuelL} L</div>
            <div className="kpi-lbl">{fuelEur} € estimés</div>
          </div>
        </div>
      </div>

      {/* Optimized order */}
      <div className="result-card">
        <div className="result-card-title">🗺️ Ordre optimisé</div>
        <ol className="opt-stops">
          {stops.map((stop, i) => (
            <li key={stop.id || i}>
              <span
                className="dot"
                style={{ background: i === 0 ? '#f97316' : i === stops.length - 1 ? '#22c55e' : '#1a365d' }}
              >
                {i === 0 ? '⚑' : i}
              </span>
              <div className="sinfo">
                <span className="sname">{stop.name}</span>
                {legs && legs[i - 1] && (
                  <span className="sleg">
                    depuis précédent : {fmtDist(legs[i - 1].distance)} · {fmtDur(legs[i - 1].duration)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Mandatory breaks */}
      {obligatoryBreaks.length === 0 ? (
        <div className="no-break-banner">
          ✅ Aucune pause réglementaire requise pour ce trajet
        </div>
      ) : (
        <div className="result-card">
          <div className="result-card-title">⚠️ Pauses réglementaires ({obligatoryBreaks.length})</div>
          <div className="breaks">
            {obligatoryBreaks.map((b, i) => (
              <div key={i} className={`break-item ${b.type === 'daily_rest' ? 'is-rest' : ''}`}>
                <span className="break-icon">{b.type === 'daily_rest' ? '🌙' : '☕'}</span>
                <div>
                  <div className="break-title">
                    {b.type === 'daily_rest' ? 'Repos journalier obligatoire' : 'Pause de conduite obligatoire'}
                  </div>
                  <div className="break-sub">
                    {fmtDur(b.duration)} — après l'étape {b.afterLeg + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
