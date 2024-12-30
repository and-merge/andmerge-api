const express = require('express');
const xss = require('xss-clean');
const cors = require('cors');
const config = require('./config/config');
const db = require('./models');
const routes = require('./routes');
const ApiError = require('./utils/apiError');
const timezone = process.env.TIME_ZONE;
const Seed = require('./db/data/index');

//For creating DB. If we update to 'force: false', then it will only update the required changes.
// if (process.env.NODE_ENV == 'local' || process.env.NODE_ENV == 'development') {
//     db.sequelize.sync({ force: true }).then(() => {
//         console.log('Drop and re-sync db.');
//         return Seed();
//     });
// }

const app = express();
const port = 3001;

// parse json request body
app.use(express.json());

// sanitize request data
app.use(xss());

// enable cors
app.use(cors());
app.options('*', cors());

if (config.env === 'production') {
    app.use('api/auth', authLimiter);
}

app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Requested resource is not found'));
});

module.exports = app;
