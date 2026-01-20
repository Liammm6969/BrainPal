import api from "../api/api";

export const askAI = async (question: string): Promise<string> => {
  const res = await api.post<{ answer: string }>("/ai/ask", { question });
  return res.data.answer;
};

interface SummarizeFilePayload {
  filename: string;
  url: string;
}

export const summarizeFiles = async (
  files: SummarizeFilePayload[],
  instructions: string
): Promise<string> => {
  const res = await api.post<{ summary: string }>("/ai/summarize", {
    files,
    instructions,
  });
  return res.data.summary;
};
