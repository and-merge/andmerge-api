const httpStatus = require('http-status');

const { userService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.status.CREATED).send(user);
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUser(req.params.id);
    if (!user) throw new ApiError(httpStatus.status.NOT_FOUND, 'User not found');
    res.send(user);
});

const getUserByEmail = catchAsync(async (req, res) => {
    const { email } = req.params;
    if (!email) throw new ApiError(httpStatus.status.BAD_REQUEST, 'Please enter an email');
    const user = await userService.getUserByEmail(email);
    if (!user) throw new ApiError(httpStatus.status.NOT_FOUND, 'User not found');
    res.send(user);
});

module.exports = {
    createUser,
    getUser,
    getUserByEmail
}