# AutoAssesAI Backend

## Setup & Running

1.  **Prerequisites**:
    - Node.js installed.
    - MongoDB running locally or a valid Atlas URI.
    - Gemini API Key.

2.  **Environment Variables**:
    - Rename/Edit `.env` file in `server/` directory.
    - Set `MONGO_URI` (e.g., `mongodb://localhost:27017/autoassesai`).
    - Set `GEMINI_API_KEY` (Get from Google AI Studio).

3.  **Run Server**:
    ```bash
    cd server
    npm install
    npm run dev
    ```

## React Frontend

1.  **Setup**:
    ```bash
    cd client
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:5173`.

## API Endpoints & Sample Requests

### 1. Register User (Teacher)
**POST** `/api/auth/register`
```json
{
  "name": "Arun Kumar",
  "email": "arun@school.com",
  "password": "password123",
  "role": "teacher"
}
```

### 2. Login
**POST** `/api/auth/login`
```json
{
  "email": "arun@school.com",
  "password": "password123"
}
```
**Response**: Returns `{ token: "..." }`. Use this token in Headers: `Authorization: Bearer <token>` for subsequent requests.

### 3. Generate Assessment (Teacher Only)
**POST** `/api/assessments/generate`
**Headers**: `Authorization: Bearer <token>`
```json
{
  "title": "Photosynthesis Quiz",
  "subject": "Biology",
  "grade": "10",
  "difficulty": "medium",
  "topic": "Photosynthesis process and factors",
  "questionCount": 5
}
```

### 4. Submit Assessment (Student Only)
**POST** `/api/assessments/submit`
**Headers**: `Authorization: Bearer <token>`
```json
{
  "assessmentId": "65a...",
  "responses": [
    {
      "questionId": "65b...",
      "studentAnswer": "Chlorophyll traps sunlight."
    }
  ]
}
```
