const {
  // Node.
  NODE_ENV: ENV_NODE_ENV,

  // Numbers/Strings.
  PORT: ENV_PORT,
} = process.env;

// -----------------------------------------------------------------------------

// Booleans.
export const IS_DEV_ENV = ENV_NODE_ENV === 'development';
export const IS_PROD_ENV = ENV_NODE_ENV === 'production';
export const IS_TEST_ENV = ENV_NODE_ENV === 'test';

// Numbers/Strings.
export const HTTP_PORT = IS_DEV_ENV ? 3015 : 8080;
export const HTTPS_PORT = IS_DEV_ENV ? 3016 : 8443;
export const PORT = ENV_PORT;

// URIs.
export const PUBLIC_URL = '/';
