const express = require('express');
const xss = require('xss');
const compression = require('compression');
const cors = require('cors');
const config = require('./config/config');
const db = require('./models');
const routes = require('./routes');
const ApiError = require('./utils/ApiError');
const timezone = process.env.TIME_ZONE;
const Seed = require('./db/data/index');
const httpStatus = require('http-status');
const passport = require('./config/passport').passport;

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
app.use(express.json({ limit: '50mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// sanitize request data
// const sanitizeRequestBody = (req, res, next) => {

//     if (!req.body.documentation) {
//         return next();
//     }

//     const allowedTags = ['<p>', '<br>', '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>', '<ul>', '<ol>', '<li>', '<b>', '<i>', '<strong>'];

//     req.body.documentation = xss(req.body.documentation, {
//         whiteList: allowedTags,
//         stripIgnoreTag: true,
//         stripIgnoreTagBody: ['script', 'style'] 
//     });

//     return next();
// };

// app.use(sanitizeRequestBody);

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(passport.initialize());

app.use((req, res, next) => {
    const publicRoutes = ['/api/auth/login'];

    if (publicRoutes.includes(req.path)) {
        return next();
    }

    passport.authenticate('jwt', { session: false })(req, res, next);
});

if (config.env === 'production') {
    // app.use('api/auth', authLimiter);
}

app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.status.NOT_FOUND, 'Requested resource is not found'));
});

module.exports = app;
