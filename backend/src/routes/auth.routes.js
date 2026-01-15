const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller");
const asyncHandler = require("../utils/asyncHandler");

router.post("/signup", asyncHandler(signup));
router.post("/login", signin);

router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password/:token", asyncHandler(resetPassword));

module.exports = router;
