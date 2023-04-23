import express from 'express';
import helmet from 'helmet';

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
app.use(helmet());
app.use(express.json());

// API Routes
app.use(`${API_ROOT}/health`, health);
app.use(`${API_ROOT}/score`, score);

// Serve static files from the React app
app.use(STATIC_ROOT, express.static(STATIC_DIR));
if (!IS_DEV_ENV) {
  app.get(`${PUBLIC_URL}/2014`, (_req, res) => {
    res.sendFile('2014/index.html', { root: STATIC_DIR });
  });
  app.get(`${PUBLIC_URL}/2018`, (_req, res) => {
    res.sendFile('2018/index.html', { root: STATIC_DIR });
  });
  app.get(`${PUBLIC_URL}`, (_req, res) => {
    res.sendFile('index.html', { root: STATIC_DIR });
  });
}

// -----------------------------------------------------------------------------

export default app;
