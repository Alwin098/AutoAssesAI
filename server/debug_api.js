const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

async function verify() {
    let token;
    try {
        console.log("1. Testing Login...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: "api.tester@test.com",
            password: "password123"
        });
        token = loginRes.data.token;
        console.log("   ✅ Login successful\n");

        console.log("2. Testing Assessment Generation...");
        console.log("   (Calling API with detailed error logging)\n");

        try {
            const genRes = await axios.post(`${API_URL}/assessments/generate`, {
                title: "Debug Test Quiz",
                subject: "Science",
                grade: "10",
                difficulty: "easy",
                topic: "Basic Chemistry"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("   ✅ SUCCESS: Assessment Generated!");
            console.log(`   Title: ${genRes.data.title}`);
            console.log(`   Questions: ${genRes.data.questions?.length || 0}`);
            console.log(`   ID: ${genRes.data._id}`);

        } catch (genError) {
            console.error("\n   ❌ GENERATION FAILED");
            if (genError.response) {
                console.error("   Status:", genError.response.status);
                console.error("   Error Message:", genError.response.data.message);
                console.error("   Full Error:", JSON.stringify(genError.response.data, null, 2));
            } else {
                console.error("   Error:", genError.message);
            }
        }

    } catch (error) {
        console.error("\n❌ UNEXPECTED ERROR:");
        console.error("   Message:", error.message);
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

verify();
