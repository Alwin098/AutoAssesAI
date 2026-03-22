const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verify() {
    let token;
    try {
        console.log("1. Testing Registration...");
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: "API Tester",
                email: "api.tester@test.com",
                password: "password123",
                role: "teacher"
            });
            console.log("   SUCCESS: Registration successful.");
        } catch (err) {
            if (err.response && err.response.data.message === 'User already exists') {
                console.log("   INFO: User already exists. Proceeding to login.");
            } else {
                throw err;
            }
        }

        console.log("2. Testing Login...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: "api.tester@test.com",
            password: "password123"
        });
        token = loginRes.data.token;
        console.log("   SUCCESS: Login successful. Token obtained.");

        console.log("\n3. Testing Assessment Generation (AI)...");
        console.log("   (This may take 30-60s using gemini-1.5-flash)");
        const genRes = await axios.post(`${API_URL}/assessments/generate`, {
            title: "API Verification Quiz",
            subject: "Computer Science",
            grade: "12",
            difficulty: "Medium",
            topic: "Neural Networks"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("   SUCCESS: Assessment Generated.");
        console.log(`   Title: ${genRes.data.title}`);
        console.log(`   Questions Created: ${genRes.data.questions ? genRes.data.questions.length : 0}`);

        /*
        console.log("\n4. Testing Fetch Assessments...");
        const listRes = await axios.get(`${API_URL}/assessments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const found = listRes.data.find(a => a.title === "API Verification Quiz");
        if (found) {
            console.log("   SUCCESS: Assessment found in list.");
        } else {
            console.error("   FAILURE: Assessment NOT found in list.");
        }
        */

    } catch (error) {
        console.error("\nFAILURE_DETAILS:");
        if (error.code) console.error("   Code:", error.code);
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("   Message:", error.message);
        }
    }
}

verify();
