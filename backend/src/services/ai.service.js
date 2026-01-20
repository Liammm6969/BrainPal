const openRouter = require("../config/openrouter.js");

const askStudyAI = async (prompt) => {
  const response = await openRouter.post("/chat/completions", {
    model: "deepseek/deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI study assistant. Explain clearly and step by step.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.data.choices[0].message.content;
};

const summarizeText = async (text) => {
  try {
    const response = await openRouter.post("/chat/completions", {
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an expert study assistant. Summarize the content clearly, concisely, and in bullet points.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:");
    console.error(error.response?.data || error.message);
    throw error;
  }
};

module.exports = { askStudyAI, summarizeText };