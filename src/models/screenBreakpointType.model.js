module.exports = (sequelize, Sequelize) => {
    const ScreenBreakpointType = sequelize.define('screen_breakpoint_types', {
        name: {
            type: Sequelize.STRING(255),
        },
    }, {
        timestamps: false
    });

    return ScreenBreakpointType;
}