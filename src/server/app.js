import express from 'express';

// Constants.
import {
  PUBLIC_URL,
  API_ROOT,
  STATIC_ROOT,
  STATIC_DIR,
  IS_DEV_ENV,
} from './constants';

// Routes.
import { health, score } from './routes';

// -----------------------------------------------------------------------------

const app = express();

// Middleware.
app.use(express.json());

// API Routes
app.use(`${API_ROOT}/health`, health);
app.use(`${API_ROOT}/score`, score);

// Serve static files from the React app
app.use(STATIC_ROOT, express.static(STATIC_DIR));
if (!IS_DEV_ENV) {
  app.get(`${PUBLIC_URL}/*`, (_req, res) => {
    res.sendFile('index.html', { root: STATIC_DIR });
  });
}

// -----------------------------------------------------------------------------

export default app;
