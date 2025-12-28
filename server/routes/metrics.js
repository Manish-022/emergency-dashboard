const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

router.get('/', async (req, res) => {
    try {
        const totalIncidents = await Incident.countDocuments();
        const resolvedIncidents = await Incident.countDocuments({ status: 'Resolved' });

        // Aggregation for severity
        const incidentsBySeverity = await Incident.aggregate([
            { $group: { _id: '$severity', count: { $sum: 1 } } }
        ]);

        // Average Response Time Calculation
        const resolvedDocs = await Incident.find({ status: 'Resolved', resolvedAt: { $exists: true } });
        let totalTime = 0;
        resolvedDocs.forEach(doc => {
            totalTime += (new Date(doc.resolvedAt) - new Date(doc.createdAt));
        });
        const averageResponseTime = resolvedDocs.length > 0 ? (totalTime / resolvedDocs.length) : 0;

        res.json({
            totalIncidents,
            resolvedIncidents,
            incidentsBySeverity,
            averageResponseTime // in milliseconds
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
