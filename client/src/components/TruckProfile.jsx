import './TruckProfile.css';

function Field({ label, value, onChange, min, max, step, unit }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input-unit">
        <input
          type="number"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
        />
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
}

export default function TruckProfile({ profile, onChange }) {
  const set = (key, val) => onChange({ ...profile, [key]: val });

  return (
    <div className="truck-profile">
      <div className="profile-section">
        <div className="section-title">🚛 Dimensions & poids</div>
        <div className="fields-row">
          <Field label="Poids total" value={profile.weight} onChange={v => set('weight', v)}
            min={1} max={44} step={0.5} unit="t" />
          <Field label="Hauteur" value={profile.height} onChange={v => set('height', v)}
            min={1} max={4.5} step={0.1} unit="m" />
        </div>
        <div className="fields-row">
          <Field label="Longueur" value={profile.length} onChange={v => set('length', v)}
            min={5} max={25.25} step={0.5} unit="m" />
          <Field label="Largeur" value={profile.width || 2.55} onChange={v => set('width', v)}
            min={1} max={2.6} step={0.05} unit="m" />
        </div>
        <div className="weight-bar">
          <input type="range" min={1} max={44} step={0.5} value={profile.weight}
            onChange={e => set('weight', parseFloat(e.target.value))} />
          <span className="weight-label">{profile.weight}t / 44t max UE</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-title">⛽ Carburant</div>
        <div className="fields-row">
          <Field label="Consommation" value={profile.fuelConsumption} onChange={v => set('fuelConsumption', v)}
            min={15} max={80} step={0.5} unit="L/100km" />
          <Field label="Prix" value={profile.fuelPrice} onChange={v => set('fuelPrice', v)}
            min={0.5} max={4} step={0.01} unit="€/L" />
        </div>
      </div>

      <div className="profile-section regs">
        <div className="section-title">📋 Réglementation EU (CE 561/2006)</div>
        <ul className="reg-list">
          <li><span>⏱️</span> Conduite continue max <strong>4h30</strong></li>
          <li><span>☕</span> Pause obligatoire <strong>45 min</strong> (ou 15+30)</li>
          <li><span>🌙</span> Conduite journalière max <strong>9h</strong> (10h × 2/sem.)</li>
          <li><span>🏠</span> Repos journalier min <strong>11h</strong> consécutives</li>
          <li><span>📅</span> Conduite hebdo max <strong>56h</strong></li>
        </ul>
      </div>

      <div className="profile-section disclaimer">
        <p>⚠️ Le routage utilise le profil voiture OSRM (API gratuite). Pour des restrictions de hauteur et de poids précises, un service de routage spécialisé poids lourds est recommandé.</p>
      </div>
    </div>
  );
}
