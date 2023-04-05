import express from 'express';

// Constants.
import {
  PUBLIC_URL,
  API_ROOT,
  STATIC_ROOT,
  STATIC_DIR,
  IS_DEV_ENV,
} from './constants/index';

// Middleware.
// TODO

// Routes.
import health from './routes/health';

// -----------------------------------------------------------------------------

const app = express();

// gzip
// app.use(compression());

// Middleware.
// TODO

// API Routes
app.use(`${API_ROOT}/health`, health);

// Serve static files from the React app
app.use(STATIC_ROOT, express.static(STATIC_DIR));
if (!IS_DEV_ENV) {
  app.get(`${PUBLIC_URL}/*`, (_req, res) => {
    res.sendFile('index.html', { root: STATIC_DIR });
  });
}

// Error Handling
// TODO

// -----------------------------------------------------------------------------

export default app;