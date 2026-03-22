const asyncHandler = require('express-async-handler');
const Submission = require('../models/submissionModel');
const User = require('../models/userModel');

// @desc    Get all submissions for the logged-in student
// @route   GET /api/submissions/my-results
// @access  Private (Student)
const getMyResults = asyncHandler(async (req, res) => {
    const submissions = await Submission.find({ studentId: req.user._id })
        .populate('assessmentId', 'title subject')
        .sort({ createdAt: -1 }); // Most recent first

    res.json(submissions);
});

// @desc    Get single submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = asyncHandler(async (req, res) => {
    const submission = await Submission.findById(req.params.id)
        .populate('assessmentId'); // Populate full assessment including questions

    if (!submission) {
        res.status(404);
        throw new Error('Submission not found');
    }

    // Verify that the submission belongs to the logged-in user
    if (submission.studentId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this submission');
    }

    res.json(submission);
});

// @desc    Get leaderboard with student rankings
// @route   GET /api/submissions/leaderboard
// @access  Private
const getLeaderboard = asyncHandler(async (req, res) => {
    // Aggregate submissions to calculate average scores per student
    const leaderboard = await Submission.aggregate([
        {
            $group: {
                _id: '$studentId',
                totalScore: { $sum: '$totalScore' },
                totalMaxScore: { $sum: '$maxScore' },
                totalAttempts: { $sum: 1 }
            }
        },
        {
            $project: {
                studentId: '$_id',
                averageScore: {
                    $multiply: [
                        { $divide: ['$totalScore', '$totalMaxScore'] },
                        100
                    ]
                },
                totalAttempts: 1,
                _id: 0
            }
        },
        {
            $sort: { averageScore: -1 }
        },
        {
            $limit: 20
        }
    ]);

    // Populate student names
    const leaderboardWithNames = await Promise.all(
        leaderboard.map(async (entry) => {
            const student = await User.findById(entry.studentId).select('name');
            return {
                studentId: entry.studentId,
                studentName: student ? student.name : 'Unknown',
                averageScore: Math.round(entry.averageScore * 10) / 10, // Round to 1 decimal
                totalAttempts: entry.totalAttempts
            };
        })
    );

    res.json(leaderboardWithNames);
});

// @desc    Get all submissions for a specific assessment (for teacher view)
// @route   GET /api/submissions/assessment/:assessmentId
// @access  Private (Teacher)
const getSubmissionsByAssessment = asyncHandler(async (req, res) => {
    const submissions = await Submission.find({ assessmentId: req.params.assessmentId })
        .populate('studentId', 'name email')
        .sort({ createdAt: -1 });

    res.json(submissions);
});

module.exports = {
    getMyResults,
    getSubmissionById,
    getLeaderboard,
    getSubmissionsByAssessment,
};
