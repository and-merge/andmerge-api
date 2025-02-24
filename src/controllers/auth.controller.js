const httpStatus = require('http-status');
const catchAsync = require("../utils/catchAsync");
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');
const { verifyFigmaToken } = require('../config/passport');


const login = catchAsync(async (req, res) => {
    let figmaToken = req.body;

    if (!figmaToken) {
        return res.status(400).json({ message: 'Figma token is required' });
    }

    const result = await verifyFigmaToken(figmaToken);

    if (!result) {
        return res.status(401).json({ message: 'Invalid Figma token' });
    }

    res.send({ user: result.user, jwtToken: result.jwtToken });
});

module.exports = {
    login
}