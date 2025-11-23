import { GoogleGenAI } from "@google/genai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.geminiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "API key not found",
    });
  }

  const body = await readBody(event);
  const userName = body.userName;
  const transactions = body.transactions;

  const recentTransactions = transactions.slice(0, 50);
  const prompt = `
    Analyze the following financial transactions for the user ${userName}.
    Provide a helpful, friendly summary in Markdown format.
    
    Data: ${JSON.stringify(recentTransactions)}
    
    Please include:
    1. A quick summary of spending habits.
    2. Identification of the largest expense category.
    3. Actionable advice to save money based on this data.
    4. Tone: Encouraging, professional financial advisor. Use emojis sparingly.
    5. Language: Indonesian (Bahasa Indonesia).

    CRITICAL RULES:
    - Prioritaskan Keringkasan:** Respons harus padat dan ringkas. Hindari pengulangan dan penjelasan yang bertele-tele. Langsung ke intinya untuk setiap poin.
    - Format Poin Per Poin:** Gunakan daftar berpoin (bullet points) untuk setiap bagian analisis (1, 2, dan 3) guna memaksimalkan keterbacaan dan keringkasan.
    - Gunakan Bahasa Indonesia yang lebih modern dan sopan:** Pastikan terminologi keuangan dalam Bahasa Indonesia baku.

  `;

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.text || "Maaf, saya tidak dapat menganalisis data saat ini."
    );
  } catch (error) {
    console.error("Error analyzing finances:", error);
    return "Terjadi kesalahan saat menghubungkan ke AI Assistant.";
  }
});
