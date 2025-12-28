require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const incidentRoutes = require('./routes/incidents');
const unitRoutes = require('./routes/units');
const metricsRoutes = require('./routes/metrics');

app.use('/api/incidents', incidentRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/metrics', metricsRoutes);

app.get('/', (req, res) => {
    res.send('Emergency Response API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Start the simulation loop
    const simulation = require('./simulate');
    simulation.start();
});
