const express = require("express");
const router = express.Router();
const {signup, signin} = require("../controller/auth.controller");
const asyncHandler = require("../utils/asyncHandler")

router.post("/signup", asyncHandler(signup));
router.post("/login", signin);

module.exports = router;