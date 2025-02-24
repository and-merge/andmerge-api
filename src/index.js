const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { boss } = require('./pgboss');

let server;

server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port} ${config.env}`);
});

async function startBoss() {
    boss.on('error', console.error);
    await boss.start();
    console.log("pg-boss started...");
}

startBoss().catch(console.error);