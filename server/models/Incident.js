const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
    description: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    type: { type: String }, // e.g., Fire, Medical, Crime - derived from AI
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    status: {
        type: String,
        enum: ['Reported', 'Assigned', 'Resolved'],
        default: 'Reported'
    },
    assignedUnit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
});

IncidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', IncidentSchema);
