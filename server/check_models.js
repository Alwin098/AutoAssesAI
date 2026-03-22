const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

async function listModels() {
    try {
        const response = await axios.get(URL);
        const fs = require('fs');
        const list = response.data.models
            .filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => `- ${m.name} (${m.version})`)
            .join('\n');
        fs.writeFileSync('models.txt', list);
        console.log("Models written to models.txt");
    } catch (error) {
        console.error("Error listing models:", error.response ? error.response.data : error.message);
    }
}

listModels();
