const mongoose = require('mongoose');
const Incident = require('./models/Incident');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ercd')
    .then(async () => {
        console.log('Connected to MongoDB...');
        await Incident.deleteMany({});
        console.log('All incidents cleared.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
