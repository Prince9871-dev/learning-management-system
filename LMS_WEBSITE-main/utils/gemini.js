import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Uses Google Gemini API to answer student doubts
 * Provides hints only, no full code solutions
 */
export const answerDoubt = async (question, context = '') => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a helpful coding tutor. A student is asking: "${question}"

${context ? `Context: ${context}` : ''}

Rules:
- Explain the concept simply and clearly
- Do NOT provide full code solutions
- Provide hints and guidance only
- Make it interview-friendly
- Help them understand the approach, not copy code

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { success: true, answer: text };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return { success: false, error: error.message };
  }
};

