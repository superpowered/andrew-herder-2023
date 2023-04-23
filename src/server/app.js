import express from 'express';
import helmet from 'helmet';

// Constants.
import {
  PUBLIC_PATH,
  API_ROOT,
  STATIC_ROOT,
  STATIC_DIR,
  IS_DEV_ENV,
} from './constants';

// Middleware.
import { authRequest } from './middleWare';

// Routes.
import { health, score } from './routes';

// -----------------------------------------------------------------------------

const app = express();

// Middleware.
app.use(helmet());
app.use(express.json());

// API Routes
app.use(`${API_ROOT}/health`, health);
app.use(`${API_ROOT}/score`, authRequest, score);

// Serve static files from the React app
app.use(STATIC_ROOT, express.static(STATIC_DIR));
if (!IS_DEV_ENV) {
  app.get(`${PUBLIC_PATH}2014`, (_req, res) => {
    res.sendFile('2014/index.html', { root: STATIC_DIR });
  });
  app.get(`${PUBLIC_PATH}2018`, (_req, res) => {
    res.sendFile('2018/index.html', { root: STATIC_DIR });
  });
  app.get(`${PUBLIC_PATH}`, (_req, res) => {
    res.sendFile('index.html', { root: STATIC_DIR });
  });
}

// -----------------------------------------------------------------------------

export default app;
