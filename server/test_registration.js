const axios = require('axios');

async function testRegistration() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'test123',
            role: 'teacher'
        });
        console.log('✅ Registration SUCCESS');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ Registration FAILED');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data);
        } else if (error.request) {
            console.log('No response from server');
            console.log('Is the backend running on port 5000?');
        } else {
            console.log('Error:', error.message);
        }
    }
}

testRegistration();
