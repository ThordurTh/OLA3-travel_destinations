// passport-config.js
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const dotenv = require("dotenv");
dotenv.config();

const User = require("./schemas/User"); // Replace with your User model

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.jwt_secret,
};

const strategy = new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id); // Assuming you store the user's ID in the token
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(strategy);

module.exports = passport;
