const asyncHandler = require('express-async-handler');
const Class = require('../models/classModel');

// @desc    Create a new class
// @route   POST /api/class/create
// @access  Private/Teacher
const createClass = asyncHandler(async (req, res) => {
    const { name, subject } = req.body;

    if (!name || !subject) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Generate unique 6-8 char alphanumeric class code
    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        const length = Math.floor(Math.random() * 3) + 6; // 6 to 8 chars
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    let classCode = generateCode();
    let isUnique = false;

    // Ensure uniqueness
    while (!isUnique) {
        const existingClass = await Class.findOne({ classCode });
        if (existingClass) {
            classCode = generateCode();
        } else {
            isUnique = true;
        }
    }

    const newClass = await Class.create({
        name,
        subject,
        teacherId: req.user._id,
        classCode,
        students: [],
    });

    res.status(201).json(newClass);
});

// @desc    Get all classes for a teacher
// @route   GET /api/class/teacher/:teacherId
// @access  Private/Teacher
const getTeacherClasses = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    
    // Verify that the requested teacherId matches the logged in user
    if (req.user._id.toString() !== teacherId) {
        res.status(401);
        throw new Error('Not authorized to view these classes');
    }

    const classes = await Class.find({ teacherId }).sort({ createdAt: -1 });

    res.status(200).json(classes);
});

// @desc    Get single class details with populated students and teacher
// @route   GET /api/class/:classId
// @access  Private/Teacher
const getClassById = asyncHandler(async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.classId)
            .populate("students", "name email")
            .populate("teacherId", "name email");

        if (!classItem) {
            return res.status(404).json({ message: "Class not found" });
        }

        if (classItem.teacherId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(classItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @desc    Join a class
// @route   POST /api/class/join
// @access  Private/Student
const joinClass = asyncHandler(async (req, res) => {
    const { classCode } = req.body;

    if (!classCode) {
        res.status(400);
        throw new Error('Please provide a class code');
    }

    const targetClass = await Class.findOne({ classCode });

    if (!targetClass) {
        res.status(404);
        throw new Error('Class not found');
    }

    // Check if student already joined
    if (targetClass.students.some(studentId => studentId.toString() === req.user._id.toString())) {
        res.status(400);
        throw new Error('You have already joined this class');
    }

    targetClass.students.push(req.user._id);
    await targetClass.save();

    res.status(200).json({ message: 'Successfully joined the class', class: targetClass });
});

// @desc    Get all classes a student has joined
// @route   GET /api/class/student/:studentId
// @access  Private/Student
const getStudentClasses = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    // Verify that the requested studentId matches the logged in user
    if (req.user._id.toString() !== studentId) {
        res.status(401);
        throw new Error('Not authorized to view these classes');
    }

    const classes = await Class.find({ students: studentId })
        .populate('teacherId', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(classes);
});

module.exports = {
    createClass,
    getTeacherClasses,
    joinClass,
    getStudentClasses,
    getClassById,
};
