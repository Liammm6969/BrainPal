const passport = require("passport");
const localStrategy = require("./local.strategy");
const jwtStrategy = require("./jwt.strategy");

passport.use(localStrategy);
passport.use(jwtStrategy);

module.exports = passport;