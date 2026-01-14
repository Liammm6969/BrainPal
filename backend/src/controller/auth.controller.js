const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const passport = require("passport") 

const generateToken = (user) => {
    const id = user._id || user.id;
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Sign up
exports.signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user),
    });
};

// Sign in
exports.signin = (req, res, next) => {
    passport.authenticate("local", { session: false}, (err, user, info) => {
        if(err) return next(err);
        if(!user) return res.status(401).json(info);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user)
        })
    })(req, res, next);
}