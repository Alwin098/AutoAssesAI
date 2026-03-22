const express = require('express');
const router = express.Router();
const {
    createClass,
    getTeacherClasses,
    joinClass,
    getStudentClasses,
    getClassById,
} = require('../controllers/classController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.post('/create', protect, teacher, createClass);
router.get('/teacher/:teacherId', protect, teacher, getTeacherClasses);
router.get('/:classId', protect, teacher, getClassById);
router.post('/join', protect, joinClass);
router.get('/student/:studentId', protect, getStudentClasses);

module.exports = router;
