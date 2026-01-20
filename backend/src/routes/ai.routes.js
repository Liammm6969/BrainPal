const express = require("express");
const { askAI, summarize } = require("../controller/ai.controller.js");
const { aiLimiter } = require("../middleware/rateLimit.js");
const router = express.Router();

router.post("/ask", aiLimiter, askAI);
router.post("/summarize", aiLimiter, summarize);

module.exports = router;
