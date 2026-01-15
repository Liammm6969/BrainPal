const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/email");

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

  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

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
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  })(req, res, next);
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your BrainPal password",
        text: `Reset your password here: ${resetUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif">
            <h2>Password Reset</h2>
            <p>Hello ${user.name},</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}"
               style="display:inline-block;padding:10px 16px;
                      background:#2563eb;color:#fff;
                      text-decoration:none;border-radius:6px;">
              Reset Password
            </a>
            <p style="margin-top:16px;">
              This link will expire in 15 minutes.
            </p>
          </div>
        `,
      });
      res.json({ message: "Password reset email sent" });
    } catch (emailError) {
      return res.status(500).json({ 
        message: "Failed to send email. Please try again later."
      });
    }
  } catch (err) {
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
