const openRouter = require("../config/openrouter.js");
const fs = require("fs");
const axios = require("axios");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

// Ask general study question
const askStudyAI = async (question) => {
  const response = await openRouter.post("/chat/completions", {
    model: "deepseek/deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "You are an expert study assistant. Answer questions clearly, concisely, and with helpful explanations.",
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return response.data.choices[0].message.content;
};

// Summarize plain text (not used by notes flow yet, but kept for flexibility)
const summarizeText = async (text, instructions = "") => {
  const prompt = `
Generate concise, well-structured study notes from the following text:
${text}
${instructions ? `Additional instructions: ${instructions}` : ""}
Focus on key concepts, definitions, and actionable takeaways.
  `;

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
        content: prompt,
      },
    ],
  });

  return response.data.choices[0].message.content;
};

// Extract DOCX text
const extractDocxText = async (buffer) => {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
};

// Extract PDF text
const extractPdfText = async (buffer) => {
  const { text } = await pdfParse(buffer);
  return text;
};

// Extract file text from buffer (DOCX or PDF)
const extractFileText = async (file) => {
  let buffer;
  if (file.url && file.url.startsWith("http")) {
    const res = await axios.get(file.url, { responseType: "arraybuffer" });
    buffer = Buffer.from(res.data);
  } else if (file.path) {
    buffer = fs.readFileSync(file.path);
  } else {
    throw new Error("File must have either a url or path");
  }

  if (file.filename.endsWith(".docx")) {
    return extractDocxText(buffer);
  } else if (file.filename.endsWith(".pdf")) {
    return extractPdfText(buffer);
  } else {
    throw new Error("Unsupported file type");
  }
};

// Summarize multiple files
const summarizeFiles = async (files, instructions = "") => {
  let combinedText = "";

  for (const file of files) {
    const content = await extractFileText(file);
    combinedText += `\n${file.filename}:\n${content}\n`;
  }

  const prompt = `
Generate concise, well-structured study notes from the following content:
${combinedText}
${instructions ? `Additional instructions: ${instructions}` : ""}
Focus on key concepts, definitions, and actionable takeaways.
  `;

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
        content: prompt,
      },
    ],
  });

  return response.data.choices[0].message.content;
};

module.exports = { askStudyAI, summarizeText, summarizeFiles };

