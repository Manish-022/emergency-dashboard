const axios = require('axios');

const PORT = process.env.PORT || 5000;
const BACKEND_URL = `http://localhost:${PORT}/api`;

const DESCRIPTIONS = [
    "Fire reported in residential building",
    "Car accident with injuries",
    "Medical emergency, chest pains",
    "Suspicious activity reported",
    "Cat stuck in tree",
    "Armed robbery in progress",
    "Water main break flooding street",
    "Public disturbance in park",
    "Gas leak reported",
    "Structure fire, commercial building"
];

// NYC Bounds roughly
const LAT_MIN = 40.7000;
const LAT_MAX = 40.8000;
const LON_MIN = -74.0200;
const LON_MAX = -73.9300;

function getRandomLocation() {
    const lat = LAT_MIN + Math.random() * (LAT_MAX - LAT_MIN);
    const lon = LON_MIN + Math.random() * (LON_MAX - LON_MIN);
    return {
        type: 'Point',
        coordinates: [lon, lat]
    };
}

function getRandomDescription() {
    return DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
}

async function createIncident() {
    try {
        const incident = {
            description: getRandomDescription(),
            location: getRandomLocation()
        };
        console.log(`[Sim] Attempting to create incident at ${BACKEND_URL}/incidents`);
        const res = await axios.post(`${BACKEND_URL}/incidents`, incident);
        console.log('Created Incident:', res.data.type, res.data.sensitivity || res.data.severity);
    } catch (err) {
        console.error('[Sim] Error creating incident:', err.message);
        if (err.response) {
            console.error('[Sim] Response status:', err.response.status);
            console.error('[Sim] Response data:', err.response.data);
        } else if (err.code === 'ECONNREFUSED') {
            console.error('[Sim] Connection refused! Is the server running?');
        }
    }
}

// Create some initial units
async function initUnits() {
    const units = [
        { name: 'Unit-101', type: 'Police' },
        { name: 'Unit-102', type: 'Police' },
        { name: 'Amb-201', type: 'Ambulance' },
        { name: 'Amb-202', type: 'Ambulance' },
        { name: 'Fire-301', type: 'Fire' }
    ];

    for (const u of units) {
        try {
            console.log(`[Sim] Creating unit ${u.name}...`);
            await axios.post(`${BACKEND_URL}/units`, {
                ...u,
                location: getRandomLocation()
            });
            console.log(`Created Unit: ${u.name}`);
        } catch (e) {
            console.log(`Unit ${u.name} might already exist or error:`, e.message);
        }
    }
}

async function start() {
    console.log("[Sim] Waiting 5 seconds for server to be ready...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("[Sim] Initializing Units...");
    await initUnits();

    console.log("[Sim] Starting Incident Simulation loop...");
    createIncident();
    setInterval(createIncident, 10000); // New incident every 10 seconds
}

module.exports = { start };
