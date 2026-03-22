const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    studentAnswer: {
        type: String,
        required: true,
    },
    aiScore: {
        type: Number,
        default: 0,
    },
    aiFeedback: {
        type: String,
    },
});

const submissionSchema = mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assessment',
            required: true,
        },
        responses: [responseSchema],
        totalScore: {
            type: Number,
            default: 0,
        },
        maxScore: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
