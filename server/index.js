import express from 'express';
import cors from 'cors';
import { geocode, reverseGeocode } from './services/geocode.js';
import { getTable, getRoute } from './services/osrm.js';
import { optimize } from './services/optimizer.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/geocode', async (req, res) => {
  try {
    const results = await geocode(req.query.q || '');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/geocode/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const result = await reverseGeocode(lat, lon);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/optimize', async (req, res) => {
  try {
    const { stops } = req.body;
    if (!stops || stops.length < 2) {
      return res.status(400).json({ error: 'Au moins 2 arrêts requis.' });
    }
    if (stops.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 arrêts.' });
    }

    const coords = stops.map(s => [s.lon, s.lat]);
    const matrix = await getTable(coords);
    const result = optimize(stops, matrix);

    const orderedCoords = result.order.map(i => coords[i]);
    const route = await getRoute(orderedCoords);

    res.json({
      order: result.order,
      stops: result.order.map(i => stops[i]),
      breaks: result.breaks,
      totalDistance: route.distance,
      totalDuration: route.duration,
      geometry: route.geometry,
      legs: route.legs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚛 Serveur démarré sur http://localhost:${PORT}`));
