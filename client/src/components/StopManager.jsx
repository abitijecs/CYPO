import { useState, useEffect, useRef } from 'react';
import './StopManager.css';

export default function StopManager({ stops, onAdd, onRemove, onMove }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.length < 3) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.slice(0, 6));
        setOpen(true);
      } catch { /* ignore */ } finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(r) {
    onAdd({
      name: r.display_name.split(',')[0].trim(),
      address: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon)
    });
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="stop-manager">
      <div className="section-title">
        <span>Points d'arrêt</span>
        <span className="stop-count">{stops.length} arrêt{stops.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="search-wrap" ref={wrapRef}>
        <div className="search-field">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une ville, adresse…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
          />
          {searching && <span className="mini-spin" />}
        </div>
        {open && results.length > 0 && (
          <ul className="results-dropdown">
            {results.map((r, i) => (
              <li key={i} onMouseDown={() => select(r)}>
                <span className="res-main">{r.display_name.split(',')[0]}</span>
                <span className="res-sub">{r.display_name.split(',').slice(1, 3).join(',').trim()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="tip">💡 Activez le mode carte pour ajouter des arrêts en cliquant sur la carte</p>

      {stops.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 44 }}>📍</div>
          <p>Aucun arrêt ajouté</p>
          <p className="empty-sub">Recherchez une adresse ci-dessus</p>
        </div>
      ) : (
        <ul className="stop-list">
          {stops.map((stop, i) => (
            <li key={stop.id} className={`stop-item ${i === 0 ? 'is-origin' : ''}`}>
              <span
                className="stop-num"
                style={{ background: i === 0 ? '#f97316' : i === stops.length - 1 ? '#22c55e' : '#1a365d' }}
              >
                {i === 0 ? '⚑' : i}
              </span>
              <div className="stop-info">
                <span className="stop-name">{stop.name}</span>
                {stop.address && <span className="stop-addr">{stop.address.split(',').slice(0, 2).join(',')}</span>}
              </div>
              <div className="stop-actions">
                <button className="btn-icon" onClick={() => onMove(stop.id, 'up')} disabled={i === 0} title="Monter">▲</button>
                <button className="btn-icon" onClick={() => onMove(stop.id, 'down')} disabled={i === stops.length - 1} title="Descendre">▼</button>
                <button className="btn-icon danger" onClick={() => onRemove(stop.id)} title="Supprimer">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
