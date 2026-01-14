const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");

module.exports = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
        try {
            const user = await User.findOne({email});
            if(!user) return done(null, false, {message: "Incorrect Email."});

            const isMatch = await user.matchPassword(password);
            if(!isMatch) return done(null, false, {message: "Incorrect Password."});

            return done(null, user);
        } catch(err){
            return done(err);
        }
    }
)