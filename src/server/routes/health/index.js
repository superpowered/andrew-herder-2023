import express from 'express';
import os from 'os';

// -----------------------------------------------------------------------------

const router = express.Router();

router.get('/', (_req, res) =>
  res.json({
    'Node Host': os.hostname(),
    'Git SHA': process?.env?.GIT_COMMIT,
  }),
);

// -----------------------------------------------------------------------------

export default router;
