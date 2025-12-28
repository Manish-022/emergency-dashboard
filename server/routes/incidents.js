const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const Unit = require('../models/Unit');
const { classifyIncident } = require('../utils/ai');

// Get all incidents
router.get('/', async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });
        res.json(incidents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new incident
router.post('/', async (req, res) => {
    try {
        const { description, location } = req.body;

        // AI Classification
        const classification = await classifyIncident(description);

        const newIncident = new Incident({
            description,
            location,
            severity: classification.severity,
            type: classification.type
        });

        const savedIncident = await newIncident.save();
        res.status(201).json(savedIncident);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Dispatch Unit to Incident
router.post('/:id/dispatch', async (req, res) => {
    const { unitId } = req.body;
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });

        // Assuming we import Unit model here or pass logic? 
        // Need to require Unit model at top if not present.
        // I'll assume I need to add it to imports.
        // For now, I'll put logic assuming Unit is available via require.

        const unit = await Unit.findById(unitId);
        if (!unit) return res.status(404).json({ message: 'Unit not found' });

        if (unit.status !== 'Idle') {
            return res.status(400).json({ message: 'Unit is not available' });
        }

        incident.status = 'Assigned';
        incident.assignedUnit = unitId;
        await incident.save();

        unit.status = 'Busy';
        unit.currentIncident = incident._id;
        await unit.save();

        res.json({ message: 'Unit dispatched', incident, unit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Resolve Incident
router.post('/:id/resolve', async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });

        incident.status = 'Resolved';
        incident.resolvedAt = new Date();
        await incident.save();

        if (incident.assignedUnit) {

            const unit = await Unit.findById(incident.assignedUnit);
            if (unit) {
                unit.status = 'Idle';
                unit.currentIncident = null;
                await unit.save();
            }
        }

        res.json(incident);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
