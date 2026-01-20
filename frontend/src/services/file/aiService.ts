import api from "../api/api";

export const askAI = async (question: string): Promise<string> => {
  const res = await api.post<{ answer: string }>("/ai/ask", { question });
  return res.data.answer;
};

export const summarizeText = async (text: string): Promise<string> => {
  const res = await api.post<{ summary: string }>("/ai/summarize", { text });
  return res.data.summary;
};