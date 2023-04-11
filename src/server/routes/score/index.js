import express from 'express';
import fs from 'fs/promises';

import { IS_DEV_ENV, DB_DIR } from '../../constants';

// -----------------------------------------------------------------------------

const disallowed = [
  'ass', 'cum', 'fag', 'gay', 'god', 'jew', 'tit'
];
const DB_PATH = DB_DIR + '/score-data.json';
const router = express.Router();

// -----------------------------------------------------------------------------


router.get('/', async (_req, res) => {
  // Get our existing data from file & serve
  let data;
  try {
    const rawData = await fs.readFile(DB_PATH);
    data = JSON.parse(rawData);
  } catch(e) {
    return res.json({
      error: 'no scores',
      scores: [{
        name: 'ASH',
        score: 999,
      }],
    });
  }
  return res.json(data);
});

router.post('/', async (_req, res) => {
  const body = _req?.body;
  
  // Get our existing data from file
  let data;
  try {
    const rawData = await fs.readFile(DB_PATH);
    data = JSON.parse(rawData);
  } catch(e) {
    if(IS_DEV_ENV) {
      data = [{
        name: 'FTR',
        score: 999999,
      }];
    }
    else {
      return res.json({
        error: 'no scores',
        scores: [{
          name: 'ASH',
          score: 999,
        }],
      });
     }
  }

  // Bail if we got  bad  data from the file
  if(!Array.isArray(data))  {
    return res.json({
      error: 'no scores array',
      scores: [{
        name: 'ASH',
        score: 999,
      }],
    });
  }

  // Bail if we don't have the 3 required fields
  const topTenOriginal = data.slice(0, 10);  
  if(!body?.score || !body?.name || !body.date) {
    return res.json({
      error: 'bad data',
      scores: topTenOriginal,
    });
  }

  // Bail if fields fail score validation
  if(!Number.isInteger(body.score)) {
    return res.json({
      error: 'bad score',
      scores: topTenOriginal,
    });
  }

  // Bail if fields fail name validation
  if(disallowed.includes(body.name.toLowerCase()) || body.name.length !== 3) {
    return res.json({
      error: 'bad name',
      scores: topTenOriginal,
    });
  }

  // Bail if fields fail date validation
  if(Number.isNaN(Date.parse(body.date))) {
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
    }
  ];
  newData.sort((thisScore, lastScore) => lastScore?.score - thisScore?.score);

  // Write new scores to file and serve
  const topTen = newData.slice(0, 10);
  try {
    const stringData = JSON.stringify(newData, null, 2);
    await fs.writeFile(DB_PATH, stringData);
  } catch(e) {
    return res.json({
      error: 'bad save',
      scores: topTen,
    });
  }
  return res.json({
    error: false,
    scores: topTen,
  });
});

// -----------------------------------------------------------------------------

export default router;
