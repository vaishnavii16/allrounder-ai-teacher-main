const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Example response structure for different subjects
const mathExample = {
  topic: "Mathematics",
  subject: "Algebra",
  explanation: "To solve this quadratic equation, we use the quadratic formula.",
  content: "ax² + bx + c = 0",
  steps: [
    "Identify coefficients a, b, and c",
    "Apply the quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
    "Calculate the discriminant: b²-4ac",
    "Find the solutions"
  ],
  boardContent: {
    type: "formula",
    formula: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
    diagram: null
  },
  examples: ["x² + 5x + 6 = 0", "2x² - 7x + 3 = 0"]
};

const scienceExample = {
  topic: "Physics",
  subject: "Motion",
  explanation: "Newton's first law states that an object at rest stays at rest and an object in motion stays in motion.",
  content: "F = ma (Force equals mass times acceleration)",
  steps: [
    "Understand that force is required to change motion",
    "Mass is resistance to acceleration",
    "Acceleration is change in velocity over time"
  ],
  boardContent: {
    type: "formula",
    formula: "F = ma",
    diagram: "force_diagram"
  },
  examples: ["A 10kg object accelerating at 2m/s²", "Calculating force needed to stop a car"]
};

// Helper function to retry API calls with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Check if it's a retryable error
      if (error.status === 503 || error.status === 429 || error.status === 500) {
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        console.log(`Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Don't retry for other types of errors
        throw error;
      }
    }
  }
};

// GET /api/ai - Generate educational response for any topic
router.get('/', async (req, res) => {
  try {
    // Validate required parameters
    const question = req.query.question;
    const topic = req.query.topic || "General";
    
    if (!question) {
      return res.status(400).json({ 
        error: 'Missing required parameter: question' 
      });
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Server configuration error: AI service not available' 
      });
    }

    const level = req.query.level || "intermediate"; // beginner, intermediate, advanced

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `You are an expert AI teacher who can teach any subject. A student asks you a question about ${topic}.

Your response should be educational, clear, and engaging. You should:
1. Provide a clear explanation suitable for ${level} level
2. Break down complex concepts into steps
3. Suggest visual content for the board when helpful
4. Give practical examples

CRITICAL JSON FORMATTING RULES:
- You must respond with ONLY a valid JSON object
- Use ONLY double quotes (") for JSON strings
- Escape any quotes inside string values with backslashes (\")
- Do NOT use smart quotes, curly quotes, or any special quote characters
- Keep all text content on single lines within JSON values
- Do NOT include any comments, explanations, or markdown formatting
- Do NOT use unescaped backslashes except for escaping quotes

Response format (use this exact structure):
{
  "topic": "${topic}",
  "subject": "specific subject area",
  "explanation": "clear explanation of the concept (escape quotes with backslashes)",
  "content": "main content or formula or concept (escape quotes with backslashes)",
  "steps": ["step 1", "step 2", "step 3"],
  "boardContent": {
    "type": "formula",
    "content": "content to display on board",
    "formula": "mathematical formula if applicable",
    "diagram": "diagram description if needed"
  },
  "examples": ["example 1", "example 2"],
  "keyPoints": ["key point 1", "key point 2"],
  "nextTopics": ["related topic 1", "related topic 2"]
}

Student Question: "${question}"

Remember: Respond with valid JSON only. Use only standard double quotes. Escape any quotes within text with backslashes. No markdown, no comments, no explanations outside the JSON object.`;

    console.log(`Processing AI request: "${question}" (${topic}, ${level})`);

    // Use retry logic for API call
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    }, 3, 2000);

    const response = await result.response;
    const text = response.text();
    
    console.log("Raw AI response:", text.substring(0, 200) + "...");
    
    // Clean up the response text to extract JSON
    let cleanText = text;
    
    // Remove any markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Remove JavaScript-style comments that Gemini sometimes includes
    cleanText = cleanText.replace(/\/\/.*$/gm, ''); // Remove single-line comments
    cleanText = cleanText.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
    
    // Extract JSON object
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : cleanText;
    
    // Additional cleanup for common issues
    let finalJsonText = jsonText
      .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
      .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\r/g, '') // Remove carriage returns
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/"/g, '"') // Replace smart quotes with regular quotes
      .replace(/"/g, '"') // Replace smart quotes with regular quotes
      .replace(/'/g, "'") // Replace smart single quotes
      .replace(/'/g, "'") // Replace smart single quotes
      .trim();

    // Try to fix common JSON formatting issues
    try {
      // First attempt at parsing
      const parsedResponse = JSON.parse(finalJsonText);
      console.log("AI response processed successfully");
      res.json(parsedResponse);
    } catch (parseError) {
      console.error("JSON parse error, attempting to fix:", parseError.message);
      console.log("Problematic JSON:", finalJsonText.substring(0, 500) + "...");
      
      // Enhanced cleanup for more complex issues
      finalJsonText = finalJsonText
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/([^\\])\\([^"\\\/bfnrt])/g, '$1\\\\$2') // Fix unescaped backslashes
        .replace(/\\$/g, '\\\\') // Fix trailing backslash
        .replace(/\\"/g, '\\\\"') // Fix escaped quotes inside strings
        .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
          // Fix unescaped quotes within string values
          return `"${p1}\\"${p2}\\"${p3}"`;
        });
      
      try {
        const parsedResponse = JSON.parse(finalJsonText);
        console.log("AI response processed successfully after cleanup");
        res.json(parsedResponse);
      } catch (secondParseError) {
        console.error("Second JSON parse error, trying manual fix:", secondParseError.message);
        
        // Try to manually fix the specific issue by parsing and reconstructing
        try {
          // Split the JSON into parts and manually fix arrays
          let manualFixText = finalJsonText;
          
          // Fix array formatting issues
          manualFixText = manualFixText.replace(
            /"examples":\s*\[(.*?)\]/s,
            (match, arrayContent) => {
              // Clean up the array content
              const cleanArrayContent = arrayContent
                .split('",')
                .map(item => item.trim().replace(/^"/, '').replace(/"$/, ''))
                .map(item => `"${item.replace(/"/g, '\\"')}"`)
                .join(', ');
              return `"examples": [${cleanArrayContent}]`;
            }
          );
          
          const parsedResponse = JSON.parse(manualFixText);
          console.log("AI response processed successfully after manual fix");
          res.json(parsedResponse);
        } catch (thirdParseError) {
          console.error("Final JSON parse error:", thirdParseError.message);
          console.log("Final problematic JSON:", finalJsonText);
          
          // If all else fails, create a fallback response
          const fallbackResponse = {
            topic: "General",
            subject: "Educational Content", 
            explanation: "I apologize, but there was an issue processing the AI response. Please try asking your question again, perhaps with simpler wording.",
            content: "Error in response processing",
            steps: ["Please try your question again", "Use simpler language", "Check your internet connection"],
            boardContent: {
              type: "text",
              content: "Please try asking your question again"
            },
            examples: ["Try rephrasing your question", "Ask a simpler version"],
            keyPoints: ["Response processing error occurred"],
            nextTopics: ["Try asking again"]
          };
          
          res.json(fallbackResponse);
        }
      }
    }

  } catch (error) {
    console.error("Error with Gemini API:", error);
    
    // Handle different types of errors with specific messages
    if (error.status === 503) {
      return res.status(503).json({ 
        error: "AI service is temporarily overloaded. Please try again in a few moments.",
        details: "The AI model is experiencing high traffic. This is temporary.",
        retryAfter: 30000 // Suggest retry after 30 seconds
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: "Too many requests. Please wait a moment before trying again.",
        details: "Rate limit exceeded. Please slow down your requests.",
        retryAfter: 60000 // Suggest retry after 1 minute
      });
    }
    
    if (error.status === 401 || error.status === 403) {
      return res.status(401).json({ 
        error: "Authentication error with AI service",
        details: "Please check API key configuration"
      });
    }
    
    // If JSON parsing fails, try to provide a fallback response
    if (error instanceof SyntaxError) {
      console.error("JSON parsing failed. Raw response might contain invalid JSON format.");
      return res.status(500).json({ 
        error: "Failed to parse AI response. Please try again.",
        details: "The AI response contained invalid JSON format."
      });
    }
    
    // Network or general API errors
    if (error.message && error.message.includes('fetch')) {
      return res.status(503).json({ 
        error: "Unable to connect to AI service. Please try again later.",
        details: "Network connectivity issue with the AI service"
      });
    }
    
    // Generic error fallback
    res.status(500).json({ 
      error: "Failed to generate response. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : "An unexpected error occurred"
    });
  }
});

// POST /api/ai - Alternative endpoint for POST requests
router.post('/', async (req, res) => {
  // Extract question from body instead of query params
  const { question, topic, level } = req.body;
  
  // Convert to query params format and call the GET handler
  req.query = { question, topic: topic || 'General', level: level || 'intermediate' };
  
  // Reuse the GET handler logic
  const getHandler = router.stack.find(layer => layer.route.methods.get);
  if (getHandler) {
    return getHandler.route.stack[0].handle(req, res);
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;
