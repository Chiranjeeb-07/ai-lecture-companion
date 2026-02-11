import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your API key
const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateSummary = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
    return "Sorry, I couldn't generate the summary. Please try again.";
  }
};

export const generateQuiz = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Based on these lecture notes, create 3 multiple choice questions with 4 options each:
    
    ${notes}
    
    Format as JSON:
    [
      {
        "question": "question text",
        "options": ["A", "B", "C", "D"],
        "correct": 0,
        "explanation": "why this answer is correct"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating quiz:', error);
    return null;
  }
};

export const generateFlashcards = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Based on these lecture notes, create 5 flashcards with term and definition:
    
    ${notes}
    
    Format as JSON:
    [
      {
        "term": "key concept",
        "definition": "clear explanation"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return null;
  }
};