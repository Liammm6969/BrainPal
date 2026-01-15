const User = require("../models/User.model");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");

const jwt = require("jsonwebtoken");
const generateToken = (user) => {
  const id = user._id || user.id;
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ 
      name, 
      email, 
      password,
      otp,
      otpExpiry,
      otpLastSent: new Date(),
    });

    try {
      await sendEmail({
        to: user.email,
        subject: "StudyBuddy Signup OTP",
        text: `Your OTP is: ${otp} (expires in 10 minutes)`,
        html: `<p>Hello ${user.name},</p>
               <p>Your OTP is: <strong>${otp}</strong></p>
               <p>It expires in 10 minutes.</p>`,
      });
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        message: emailError.message || "Failed to send OTP email" 
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "User created. Please verify your email with the OTP sent to your inbox.",
    });
  } catch (err) {
    next(err);
  }
};

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


exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const clientUrl = (process.env.CLIENT_URL).replace(/\/$/, '');
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your StudyBuddy password",
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
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ message: "No OTP found. Please request a new OTP." });

    if (user.otpAttempts >= 5)
      return res.status(429).json({ message: "Maximum OTP attempts exceeded. Request new OTP." });

    if (user.otpExpiry < new Date())
      return res.status(400).json({ message: "OTP expired. Request new OTP." });

    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const now = new Date();
    if (user.otpLastSent && now - user.otpLastSent < 30 * 1000)
      return res.status(429).json({ message: "Wait 30 seconds before requesting a new OTP" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpAttempts = 0;
    user.otpLastSent = now;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "StudyBuddy Signup OTP (Resent)",
      text: `Your new OTP is: ${otp} (expires in 10 minutes)`,
      html: `<p>Hello ${user.name},</p>
             <p>Your new OTP is: <strong>${otp}</strong></p>
             <p>It expires in 10 minutes.</p>`,
    });

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    next(err);
  }
};