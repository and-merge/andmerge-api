const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port} ${config.env}`);
});