const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['mcq', 'short_answer', 'math'],
        required: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        default: [],
    }, // For MCQs
    correctAnswer: {
        type: String, // For auto-checking (simple keys) or model reference
        required: false, // Some subjective Qs might rely purely on AI
    },
    markingScheme: {
        type: String, // Instructions for AI grader
        required: false,
        default: '',
    },
    maxMarks: {
        type: Number,
        default: 5,
    },
});

const assessmentSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        grade: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        questions: [questionSchema],
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
