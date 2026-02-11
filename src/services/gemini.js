import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateSummary = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Please summarize the following lecture notes in a clear, structured format:
    
    ${notes}
    
    Provide:
    1. Main Topic/Title
    2. Key Points (bullet points)
    3. Important Definitions
    4. Conclusion
    
    Keep it concise but informative.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return "⚠️ Error: Could not generate summary. Please check your API key and try again.";
  }
};

export const generateQuiz = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Based on these lecture notes, create 3 multiple choice questions with 4 options each:
    
    ${notes}
    
    IMPORTANT: Return ONLY valid JSON, no other text. Format:
    [
      {
        "question": "question text",
        "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
        "correct": 0,
        "explanation": "why this answer is correct"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return null;
  }
};

export const generateFlashcards = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Based on these lecture notes, create 5 flashcards with term and definition:
    
    ${notes}
    
    IMPORTANT: Return ONLY valid JSON, no other text. Format:
    [
      {
        "term": "key concept",
        "definition": "clear explanation"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return null;
  }
};