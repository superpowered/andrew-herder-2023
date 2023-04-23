import path from 'path';

// Local Modules.
import { CWD, IS_DEV_ENV, IS_PROD_ENV, PUBLIC_URL } from './env';

// -----------------------------------------------------------------------------

export const API_ROOT = `/api`;

export const STATIC_ROOT = `${PUBLIC_URL}`;

let dbDir = path.join(process.cwd(), 'db');
if (IS_DEV_ENV) {
  dbDir = path.join(process.cwd(), 'src', 'db');
} else if (IS_PROD_ENV) {
  dbDir = path.join(CWD, 'db');
}
export const DB_DIR = dbDir;

let staticDir = path.join(process.cwd(), 'dist', 'client');
if (IS_DEV_ENV) {
  staticDir = path.join(process.cwd(), 'src', 'client');
} else if (IS_PROD_ENV) {
  staticDir = path.join(CWD, 'client');
}
export const STATIC_DIR = staticDir;
