const PgBoss = require('pg-boss');
const boss = new PgBoss(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=no-verify`);

module.exports = {
    boss
}