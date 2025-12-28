const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');

// Get all units
router.get('/', async (req, res) => {
    try {
        const units = await Unit.find();
        res.json(units);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a unit (for simulation/init)
router.post('/', async (req, res) => {
    try {
        const { name, type, location } = req.body;
        const newUnit = new Unit({
            name,
            type,
            location
        });
        const savedUnit = await newUnit.save();
        res.status(201).json(savedUnit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
