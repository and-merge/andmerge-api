const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { userService } = require('../services');
const jwt = require('jsonwebtoken');

// JWT Strategy for authenticating protected routes
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        const user = await userService.getUser(jwtPayload.id);

        if (user) {
            return done(null, user);
        }

        return done(null, false);
    })
);

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: user.expiresIn });
};

const verifyFigmaToken = async (token) => {
    try {
        const response = await fetch(`${process.env.FIGMA_BASE_URI}/me`, {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return null;

        const figmaUser = await response.json();
        let user = await userService.getUserByEmail(figmaUser.email);

        if (!user) {
            user = await userService.createUser({
                email: figmaUser.email,
                name: figmaUser.handle,
                sourceId: figmaUser.id,
                imageUrl: figmaUser.img_url
            });
        };

        const jwtToken = generateToken({ id: user.id, name: user.name, email: user.email, expiresIn: token.expires_in });
        return { user, jwtToken };

    } catch (err) {
        console.error('Error verifying Figma token:', err);
        return null;
    }
}

module.exports = { passport, verifyFigmaToken };