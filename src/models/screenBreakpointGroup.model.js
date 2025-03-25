module.exports = (sequelize, Sequelize) => {
    const ScreenBreakpointGroup = sequelize.define('screen_breakpoint_groups');

    return ScreenBreakpointGroup;
}