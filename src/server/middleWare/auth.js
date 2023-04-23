const authRequest = (req, _res, next) => {
  const ip = req?.socket?.remoteAddress;
  const origin = req?.get('origin');
  const host = req?.get('host');
  const hostname = req?.hostname;
  console.log({
    ip,
    origin,
    host,
    hostname,
  });

  // if (req.method !== 'POST') {
  //   return res.status(401).send(`Method ${req.method} not allowed`);
  // }
  return next();
};

// -----------------------------------------------------------------------------

export default authRequest;
