const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Get logged-in user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
});

// @desc    Update logged-in user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const { name, phone, subject, experience } = req.body;

    user.name = name || user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.subject = subject !== undefined ? subject : user.subject;
    user.experience = experience !== undefined ? experience : user.experience;

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        subject: updatedUser.subject,
        experience: updatedUser.experience,
    });
});

module.exports = { getProfile, updateProfile };
