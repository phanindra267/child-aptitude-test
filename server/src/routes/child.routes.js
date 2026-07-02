const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Child = require('../models/Child.model');
const User = require('../models/User.model');
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// @route   GET /api/children
// @desc    Get all children for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const children = await Child.find({ parent: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: children.length,
      children
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/children
// @desc    Add a new child
router.post('/', [
  verifyToken,
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 3, max: 12 }).withMessage('Age must be between 3 and 12')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, grade, dateOfBirth } = req.body;

    const child = new Child({
      parent: req.userId,
      name,
      age,
      grade,
      dateOfBirth: dateOfBirth || new Date(Date.now() - age * 365 * 24 * 60 * 60 * 1000)
    });

    await child.save();

    // Add child to user's children array
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { children: child._id } }
    );

    res.status(201).json({
      success: true,
      child
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/children/:id
// @desc    Get child by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const child = await Child.findOne({
      _id: req.params.id,
      parent: req.userId
    }).populate('testHistory');

    if (!child) {
      return res.status(404).json({ 
        success: false, 
        message: 'Child not found' 
      });
    }

    res.json({
      success: true,
      child
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/children/:id
// @desc    Update child
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    
    const child = await Child.findOneAndUpdate(
      { _id: req.params.id, parent: req.userId },
      { name, age, grade },
      { new: true, runValidators: true }
    );

    if (!child) {
      return res.status(404).json({ 
        success: false, 
        message: 'Child not found' 
      });
    }

    res.json({
      success: true,
      child
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/children/:id
// @desc    Delete child
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const child = await Child.findOneAndDelete({
      _id: req.params.id,
      parent: req.userId
    });

    if (!child) {
      return res.status(404).json({ 
        success: false, 
        message: 'Child not found' 
      });
    }

    // Remove child from user's children array
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { children: child._id } }
    );

    res.json({
      success: true,
      message: 'Child deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
