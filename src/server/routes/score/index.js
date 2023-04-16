import express from 'express';
import fs from 'fs/promises';

// Constants
import { IS_DEV_ENV, DB_DIR } from '../../constants';

// Utils
import { parseObject } from '../../utils';

// -----------------------------------------------------------------------------

const disallowed = ['ass', 'cum', 'fag', 'gay', 'god', 'jew', 'tit'];
const DB_PATH = `${DB_DIR}/score-data.json`;
const router = express.Router();

// -----------------------------------------------------------------------------

router.get('/', async (_req, res) => {
  try {
    // Get our existing data from file & serve
    const rawData = await fs.readFile(DB_PATH);
    const data = parseObject(rawData);
    return res.json(data);
  } catch (e) {
    return res.json({
      error: 'no scores',
      error_message: e.message,
      scores: [
        {
          name: 'ASH',
          score: 999,
        },
      ],
    });
  }
});

router.post('/', async (_req, res) => {
  try {
    const body = _req?.body;

    // Get our existing data from file
    const rawData = await fs.readFile(DB_PATH);
    let data = parseObject(rawData);

    // Make the data if we're in DEV
    if (!data && IS_DEV_ENV) {
      data = [
        {
          name: 'FTR',
          score: 999999,
        },
      ];
    }

    // Bail without data
    if (!data) {
      return res.json({
        error: 'no scores',
        scores: [
          {
            name: 'ASH',
            score: 999,
          },
        ],
      });
    }

    // Bail if we got  bad  data from the file
    if (!Array.isArray(data)) {
      return res.json({
        error: 'no scores array',
        scores: [
          {
            name: 'ASH',
            score: 999,
          },
        ],
      });
    }

    // Bail if we don't have the 3 required fields
    const topTenOriginal = data.slice(0, 10);
    if (!body?.score || !body?.name || !body.date) {
      return res.json({
        error: 'bad data',
        scores: topTenOriginal,
      });
    }

    // Bail if fields fail score validation
    if (!Number.isInteger(body.score)) {
      return res.json({
        error: 'bad score',
        scores: topTenOriginal,
      });
    }

    // Bail if fields fail name validation
    if (
      disallowed.includes(body.name.toLowerCase()) ||
      body.name.length !== 3
    ) {
      return res.json({
        error: 'bad name',
        scores: topTenOriginal,
      });
    }

    // Bail if fields fail date validation
    if (Number.isNaN(Date.parse(body.date))) {
      return res.json({
        error: 'bad date',
        scores: topTenOriginal,
      });
    }

    // Append our data, and then sort by score
    const newData = [
      ...data,
      {
        score: body.score,
        name: body.name,
        date: body.date,
      },
    ];
    newData.sort(
      (thisScore, lastScore) =>
        (lastScore?.score ?? 0) - (thisScore?.score ?? 0),
    );

    // Write new scores to file and serve
    const topTen = newData.slice(0, 10);
    const stringData = JSON.stringify(newData, null, 2);
    await fs.writeFile(DB_PATH, stringData);
    return res.json({
      error: false,
      scores: topTen,
    });
  } catch (e) {
    return res.json({
      error: 'Caught Error',
      error_message: e.message,
      scores: [],
    });
  }
});

// -----------------------------------------------------------------------------

export default router;
