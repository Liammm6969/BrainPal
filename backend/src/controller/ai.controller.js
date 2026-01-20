const { askStudyAI, summarizeText } = require("../services/ai.service.js");

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
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Text is required for summarization" });
  }

  try {
    const summary = await summarizeText(text);
    res.status(200).json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Summarization failed" });
  }
};

module.exports = { askAI, summarize };