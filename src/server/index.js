import http from 'http';
import https from 'https';

// Local Modules.
import server from './app';

// -----------------------------------------------------------------------------

const httpListenerPort = process.env.NODE_ENV === 'development' ? 3015 : 8080;
const httpsListenerPort = process.env.NODE_ENV === 'development' ? 3016 : 8443;

// -----------------------------------------------------------------------------

const httpServer = http.createServer(server).listen(httpListenerPort, () => {
  console.log(`http app is listening at localhost:${httpListenerPort}`);
});

const httpsServer = https.createServer(server).listen(httpsListenerPort, () => {
  console.log(`https app is listening at localhost:${httpsListenerPort}`);
});

/**
 * Forcibly exits this process after the given seconds.
 * If the process does not gracefully exit within the given timeout, it will
 * forcibly exit. In accordance with the `process.exit` API, set
 * `process.exitCode` before calling this function to set the exit code.
 *
 * @param {Number} seconds - the number of seconds to wait before forcibly exiting
 * @returns {Timeout} the timer that will terminate this Node.js process
 */
const timeoutExit = (seconds = 5) => {
  const timeout = setTimeout(() => {
    console.eror(
      { exitCode: process.exitCode },
      `Application did not gracefully shutdown in ${seconds} seconds. Forcibly terminating.`,
    );
    process.exit();
  }, seconds * 1000);
  // un-ref the timer so Node.js exits even with this running timer
  timeout.unref();
  return timeout;
};

const closeServers = () => {
  httpServer.close(() => {
    console.log('HTTP server is shutdown');
  });
  httpsServer.close(() => {
    console.log('HTTPS server is shutdown');
  });
};

process.on('uncaughtException', (error) => {
  console.log(
    error,
    'Uncaught Exception! The server is now in an unrecoverable state. Terminating...',
  );
  closeServers();
  // the app should exit on its own when there are no daemons running nor events on the event loop

  // forcibly terminate if haven't done so gracefully within timeout
  timeoutExit();
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(
    {
      err: reason,
      promise,
    },
    'Unhandled Promise Rejection',
  );
});
