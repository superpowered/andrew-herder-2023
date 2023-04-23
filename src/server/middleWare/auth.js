// Constants.
import { IS_PROD_ENV, PUBLIC_URL } from '../constants';

// -----------------------------------------------------------------------------

const authRequest = (req, res, next) => {
  // const ip = req?.socket?.remoteAddress;
  const origin = req?.get('origin');
  // const host = req?.get('host');
  // const hostname = req?.hostname;
  // console.log({
  //   ip,
  //   origin,
  //   host,
  //   hostname,
  // });

  if (IS_PROD_ENV && origin !== PUBLIC_URL) {
    return res.status(401).send(`Disallowed`);
  }
  return next();
};

// -----------------------------------------------------------------------------

export default authRequest;
