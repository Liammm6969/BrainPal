const User = require("../models/User.model");

const checkVerified = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Email not verified. Please verify OTP." });

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkVerified;
