const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Ambulance', 'Fire', 'Police'], required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    status: {
        type: String,
        enum: ['Idle', 'Busy', 'Offline'],
        default: 'Idle'
    },
    currentIncident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }
});

UnitSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Unit', UnitSchema);
