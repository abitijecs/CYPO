import { useState, useCallback } from 'react';
import MapView from './components/MapView.jsx';
import StopManager from './components/StopManager.jsx';
import TruckProfile from './components/TruckProfile.jsx';
import RouteResults from './components/RouteResults.jsx';
import './App.css';

const DEFAULT_TRUCK = {
  weight: 40,
  height: 4.0,
  length: 16.5,
  fuelConsumption: 32,
  fuelPrice: 1.85
};

export default function App() {
  const [stops, setStops] = useState([]);
  const [truck, setTruck] = useState(DEFAULT_TRUCK);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('stops');
  const [mapClickMode, setMapClickMode] = useState(false);

  const addStop = useCallback((stop) => {
    setStops(prev => [...prev, { ...stop, id: Date.now() + Math.random() }]);
    setResult(null);
    setError(null);
  }, []);

  const removeStop = useCallback((id) => {
    setStops(prev => prev.filter(s => s.id !== id));
    setResult(null);
  }, []);

  const moveStop = useCallback((id, direction) => {
    setStops(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
    setResult(null);
  }, []);

  const optimize = async () => {
    if (stops.length < 2) {
      setError('Ajoutez au moins 2 arrêts pour optimiser le trajet.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stops, truckProfile: truck })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setResult(data);
      setTab('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-icon">🚛</span>
          <div>
            <h1>TruckRoute Optimizer</h1>
            <p className="header-sub">Optimisation de trajet pour poids lourds</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className={`btn-map-mode ${mapClickMode ? 'active' : ''}`}
            onClick={() => setMapClickMode(m => !m)}
            title="Activer le clic sur carte pour ajouter des arrêts"
          >
            {mapClickMode ? '🗺️ Mode carte actif' : '🗺️ Clic sur carte'}
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="tabs">
            <button className={`tab ${tab === 'stops' ? 'active' : ''}`} onClick={() => setTab('stops')}>
              Arrêts {stops.length > 0 && <span className="badge">{stops.length}</span>}
            </button>
            <button className={`tab ${tab === 'truck' ? 'active' : ''}`} onClick={() => setTab('truck')}>
              Véhicule
            </button>
            <button
              className={`tab ${tab === 'results' ? 'active' : ''}`}
              onClick={() => setTab('results')}
              disabled={!result}
            >
              Résultats
            </button>
          </div>

          <div className="tab-content">
            {tab === 'stops' && (
              <StopManager stops={stops} onAdd={addStop} onRemove={removeStop} onMove={moveStop} />
            )}
            {tab === 'truck' && (
              <TruckProfile profile={truck} onChange={setTruck} />
            )}
            {tab === 'results' && result && (
              <RouteResults result={result} truck={truck} />
            )}
            {tab === 'results' && !result && (
              <div className="empty-results">
                <p>Lancez une optimisation pour voir les résultats.</p>
              </div>
            )}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="optimize-bar">
            <button className="btn-optimize" onClick={optimize} disabled={loading || stops.length < 2}>
              {loading
                ? <><span className="spinner" /> Calcul en cours...</>
                : <>🗺️ Optimiser le trajet</>
              }
            </button>
            {stops.length < 2 && (
              <p className="hint">Ajoutez au moins 2 arrêts pour commencer</p>
            )}
          </div>
        </aside>

        <main className="map-wrap">
          <MapView
            stops={stops}
            result={result}
            onAddStop={addStop}
            mapClickMode={mapClickMode}
          />
        </main>
      </div>
    </div>
  );
}
