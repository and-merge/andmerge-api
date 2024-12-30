const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'uat', 'qa', 'development', 'local').required(),
        APP_HOST: Joi.string().uri().required().description('Application frontend URL'),
        APP_PORT: Joi.number().default(3000),

        DB_NAME: Joi.string().description('database name'),
        DB_HOST: Joi.string().description('database server'),
        DB_PORT: Joi.number().description('database port'),
        DB_USER: Joi.string().description('database username'),
        DB_PASS: Joi.string().description('database password'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.APP_PORT,
    appUrl: envVars.APP_HOST,
    [`${envVars.NODE_ENV}`]: {
        host: envVars.DB_HOST,
        database: envVars.DB_NAME,
        username: envVars.DB_USER,
        password: envVars.DB_PASS,
        port: envVars.DB_PORT,
        dialect: envVars.DB_DIALECT,
    },
};