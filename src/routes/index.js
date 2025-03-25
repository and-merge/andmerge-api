const express = require('express');
const userRoute = require('./user.route');
const projectRoute = require('./project.route');
const projectPageRoute = require('./projectPage.route');
const projectPageScreenRoute = require('./projectPageScreen.route');
const authRoute = require('./auth.route');
const settingsRoute = require('./settings.route');

const router = express.Router();

const defaultRoutes = [
    { path: '/users', route: userRoute },
    { path: '/projects', route: projectRoute },
    { path: '/projectPages', route: projectPageRoute },
    { path: '/projectPageScreens', route: projectPageScreenRoute },
    { path: '/auth', route: authRoute },
    { path: '/settings', route: settingsRoute },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;