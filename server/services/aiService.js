const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const cleanJson = (text) => {
    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return cleanText;
};

const generateQuestions = async (topic, grade, difficulty, count = 5) => {
    const prompt = `
    Generate ${count} distinct questions for detailed assessment.
    Context:
    - Grade: ${grade}
    - Subject/Topic: ${topic}
    - Difficulty: ${difficulty}
    - Curriculum: CBSE/ICSE (Indian Standards)

    Requirements:
    - Include a mix of:
      1. Multiple Choice Questions (MCQ) - at least 2
      2. Short Answer Questions - at least 2
      3. Math/Problem Solving (if applicable to topic) - at least 1
    - For MCQs, provide 4 options and the correct answer.
    - For Short Answer, provide a "markingScheme" (key points expected).
    - For Math, provide the final answer or formula in "correctAnswer".
    
    Output strictly in Valid JSON format with this structure:
    [
      {
        "type": "mcq" | "short_answer" | "math",
        "questionText": "Question string",
        "options": ["A", "B", "C", "D"], // Only for MCQ
        "correctAnswer": "Answer string",
        "markingScheme": "Key points for evaluation",
        "maxMarks": 1 or 2 or 5
      }
    ]
    Do not add any conversational text.
  `;

    try {
        const response = await axios.post(
            API_URL,
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        const jsonText = cleanJson(text);
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Gemini API Error (Generate):', error.response?.data || error.message);
        throw new Error('Failed to generate questions');
    }
};

const evaluateResponse = async (questionText, correctAnswer, markingScheme, studentAnswer) => {

    if (!studentAnswer) return { score: 0, feedback: "No answer provided." };

    const prompt = `
    Act as a strict teacher evaluating a student's answer.
    
    Question: "${questionText}"
    Correct Answer/Model Ref: "${correctAnswer}"
    Marking Scheme/Key Points: "${markingScheme}"
    
    Student's Answer: "${studentAnswer}"
    
    Task:
    - Evaluate the student's answer based on correctness, logic, and completeness.
    - If it's a math problem, check the steps (if shown) and final value.
    - Assign a score from 0 to 5 (5 being perfect).
    - Provide brief, constructive feedback explaining the potential mistakes or creating positive reinforcement.
    
    Output strictly in Valid JSON format:
    {
      "score": number, // 0-5
      "feedback": "string"
    }
  `;

    try {
        const response = await axios.post(
            API_URL,
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        const jsonText = cleanJson(text);
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Gemini API Error (Evaluate):', error.response?.data || error.message);
        // Fallback in case AI fails
        return { score: 0, feedback: "AI Evaluation Failed. Please review manually." };
    }
};

module.exports = { generateQuestions, evaluateResponse };
