const express = require('express');
const router = express.Router();
const { getMyResults, getSubmissionById, getLeaderboard, getSubmissionsByAssessment } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/my-results').get(protect, getMyResults);
router.route('/leaderboard').get(protect, getLeaderboard);
router.route('/assessment/:assessmentId').get(protect, getSubmissionsByAssessment);
router.route('/:id').get(protect, getSubmissionById);

module.exports = router;
