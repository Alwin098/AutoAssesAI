const asyncHandler = require('express-async-handler');
const Assessment = require('../models/assessmentModel');
const Submission = require('../models/submissionModel');
const Class = require('../models/classModel');
const { generateQuestions, evaluateResponse } = require('../services/aiService');

// @desc    Generate and Create new assessment
// @route   POST /api/assessments/generate
// @access  Private (Teacher only)
const createAssessment = asyncHandler(async (req, res) => {
    const { title, subject, grade, difficulty, topic, questionCount, classId } = req.body;

    if (!title || !subject || !grade || !difficulty || !topic || !classId) {
        res.status(400);
        throw new Error('Please provide all required fields including classId');
    }

    // Validate Class
    const targetClass = await Class.findById(classId);
    if (!targetClass) {
        res.status(404);
        throw new Error('Class not found');
    }

    if (targetClass.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to add assessments to this class');
    }

    // 1. Generate Questions via AI
    let generatedQuestions;
    try {
        generatedQuestions = await generateQuestions(topic, grade, difficulty, questionCount || 5);
    } catch (error) {
        res.status(503);
        throw new Error('AI Service unavailable for question generation');
    }

    // 2. Save to Database
    const assessment = await Assessment.create({
        title,
        subject,
        grade,
        difficulty,
        topic,
        classId,
        questions: generatedQuestions,
        createdBy: req.user._id,
    });

    res.status(201).json(assessment);
});

// @desc    Generate questions via AI only (no DB save) for preview
// @route   POST /api/assessments/generate-preview
// @access  Private (Teacher only)
const generatePreview = asyncHandler(async (req, res) => {
    const { topic, grade, difficulty, numQuestions } = req.body;
    const count = Number(numQuestions) || 5;

    try {
        const questions = await generateQuestions(topic, grade, difficulty, count);
        res.json({ questions });
    } catch (error) {
        console.error('AI Preview Error:', error);
        res.status(503).json({ message: 'AI Service unavailable. Please try again.' });
    }
});

// @desc    Save a fully-edited assessment (questions provided)
// @route   POST /api/assessments/save
// @access  Private (Teacher only)
const saveAssessment = asyncHandler(async (req, res) => {
    const { title, subject, grade, difficulty, topic, classId, questions } = req.body;

    if (!title || !subject || !grade || !difficulty || !topic || !classId) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        res.status(400);
        throw new Error('At least one question is required');
    }

    // Validate class ownership
    const targetClass = await Class.findById(classId);
    if (!targetClass) {
        res.status(404);
        throw new Error('Class not found');
    }
    if (targetClass.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to add assessments to this class');
    }

    const assessment = await Assessment.create({
        title,
        subject,
        grade,
        difficulty,
        topic,
        classId,
        questions,
        createdBy: req.user._id,
    });

    res.status(201).json(assessment);
});

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private (Student & Teacher)
const getAssessments = asyncHandler(async (req, res) => {
    // Only return assessments linked to a class (hide legacy ones without classId)
    const assessments = await Assessment.find({ classId: { $exists: true, $ne: null } }).populate('createdBy', 'name');
    res.json(assessments);
});

// @desc    Get teacher's own assessments
// @route   GET /api/assessments/teacher
// @access  Private (Teacher only)
const getTeacherAssessments = asyncHandler(async (req, res) => {
    const assessments = await Assessment.find({ createdBy: req.user._id })
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 }); // Most recent first
    res.json(assessments);
});

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
const getAssessmentById = asyncHandler(async (req, res) => {
    const assessment = await Assessment.findById(req.params.id);

    if (assessment) {
        res.json(assessment);
    } else {
        res.status(404);
        throw new Error('Assessment not found');
    }
});

// @desc    Submit assessment and get AI evaluation
// @route   POST /api/assessments/submit
// @access  Private (Student)
const submitAssessment = asyncHandler(async (req, res) => {
    const { assessmentId, responses } = req.body; // responses: [{ questionId, studentAnswer }]

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
        res.status(404);
        throw new Error('Assessment not found');
    }

    // 1. Evaluate responses in parallel
    const evaluationPromises = responses.map(async (response) => {
        // Find the original question to get context and correct answer
        const question = assessment.questions.find(
            (q) => q._id.toString() === response.questionId
        );

        if (!question) {
            return {
                questionId: response.questionId,
                studentAnswer: response.studentAnswer,
                aiScore: 0,
                aiFeedback: 'Question not found in assessment',
            };
        }

        // Call AI Service
        const aiResult = await evaluateResponse(
            question.questionText,
            question.correctAnswer,
            question.markingScheme,
            response.studentAnswer
        );

        return {
            questionId: response.questionId,
            studentAnswer: response.studentAnswer,
            aiScore: aiResult.score,
            aiFeedback: aiResult.feedback,
        };
    });

    const evaluatedResponses = await Promise.all(evaluationPromises);

    // 2. Calculate Total Score
    const totalScore = evaluatedResponses.reduce((acc, curr) => acc + curr.aiScore, 0);
    const maxScore = assessment.questions.length * 5; // Assuming 5 is max per question (from AI Service)

    // 3. Save Submission
    const submission = await Submission.create({
        studentId: req.user._id,
        assessmentId,
        responses: evaluatedResponses,
        totalScore,
        maxScore,
    });

    res.status(201).json(submission);
});

// @desc    Get filtered assessments for a student based on joined classes
// @route   GET /api/assessments/student/:studentId
// @access  Private (Student)
const getStudentAssessments = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    if (req.user._id.toString() !== studentId) {
        res.status(401);
        throw new Error('Not authorized to view these assessments');
    }

    const studentClasses = await Class.find({ students: studentId });
    const classIds = studentClasses.map((c) => c._id);

    const assessments = await Assessment.find({ classId: { $in: classIds } })
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });

    res.json(assessments);
});

// @desc    Get assessments for a specific class
// @route   GET /api/assessments/class/:classId
// @access  Private (Student & Teacher)
const getClassAssessments = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    const assessments = await Assessment.find({ classId })
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });

    res.json(assessments);
});

module.exports = {
    createAssessment,
    generatePreview,
    saveAssessment,
    getAssessments,
    getTeacherAssessments,
    getAssessmentById,
    submitAssessment,
    getStudentAssessments,
    getClassAssessments,
};
