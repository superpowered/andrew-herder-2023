// Constants.
import { IS_PROD_ENV, PUBLIC_URL } from '../constants';

// -----------------------------------------------------------------------------

const authRequest = (req, res, next) => {
  const origin = req?.get('origin');

  if (IS_PROD_ENV && origin !== PUBLIC_URL) {
    return res.status(401).send(`Disallowed`);
  }
  return next();
};

// -----------------------------------------------------------------------------

export default authRequest;
