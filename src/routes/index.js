const express = require('express');
const userRoute = require('./user.route');
const projectRoute = require('./project.route');

const router = express.Router();

const defaultRoutes = [
    { path: '/users', route: userRoute },
    { path: '/projects', route: projectRoute },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;