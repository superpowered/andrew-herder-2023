import path from 'path';

// Local Modules.
import { IS_DEV_ENV, PUBLIC_URL } from './env';

// -----------------------------------------------------------------------------

export const API_ROOT = `/api`;

export const STATIC_ROOT = `${PUBLIC_URL}`;

export const DB_DIR = IS_DEV_ENV
  ? path.join(process.cwd(), 'src', 'db')
  : path.join(process.cwd(), 'db');

export const STATIC_DIR = IS_DEV_ENV
  ? path.join(process.cwd(), 'src', 'client')
  : path.join(process.cwd(), 'client');
