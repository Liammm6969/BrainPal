const rateLimit = require("express-rate-limit");

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many AI requests. Try again later.",
});

module.exports = { aiLimiter };
