const express = require('express');
const router = express.Router();
const {
    createAssessment,
    generatePreview,
    saveAssessment,
    getAssessments,
    getTeacherAssessments,
    getAssessmentById,
    submitAssessment,
    getStudentAssessments,
    getClassAssessments,
} = require('../controllers/assessmentController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAssessments);
router.route('/student/:studentId').get(protect, getStudentAssessments);
router.route('/teacher').get(protect, teacher, getTeacherAssessments);
router.route('/generate').post(protect, teacher, createAssessment);
router.route('/generate-preview').post(protect, teacher, generatePreview);
router.route('/save').post(protect, teacher, saveAssessment);
router.route('/submit').post(protect, submitAssessment);
router.route('/class/:classId').get(protect, getClassAssessments);
router.route('/:id').get(protect, getAssessmentById);

module.exports = router;
