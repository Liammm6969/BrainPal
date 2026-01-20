const { askStudyAI, summarizeFiles } = require("../services/ai.service.js");

const askAI = async (req, res) => {
  const { question } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    const answer = await askStudyAI(question);
    res.status(200).json({ answer });
  } catch (error) {
    console.error("AI Controller Error:", error.message);
    res.status(500).json({ message: "AI service failed" });
  }
};

const summarize = async (req, res) => {
  try {
    const files = req.body.files;
    const instructions = req.body.instructions || "";

    const summary = await summarizeFiles(files, instructions);

    res.json({ summary });
  } catch (error) {
    console.error("AI Summarize Error:", error.message || error);
    res.status(500).json({ message: "Failed to generate notes" });
  }
};

module.exports = { askAI, summarize };