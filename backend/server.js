import { createServer } from 'http';
import app from './app.js';

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Déterminer le port à utiliser
 // eslint-disable-next-line no-undef
 const port = normalizePort(process.env.PORT || '4000');

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
             // eslint-disable-next-line no-undef
             process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
             // eslint-disable-next-line no-undef
             process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
