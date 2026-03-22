const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function test() {
    try {
        const response = await axios.post(
            API_URL,
            { contents: [{ parts: [{ text: "Respond with 'hi'" }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log("SUCCESS:", response.data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.error("ERROR:");
        if (err.response) {
            console.error(JSON.stringify(err.response.data, null, 2));
        } else {
            console.error(err.message);
        }
    }
}

test();
