import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import DispatchModal from './components/DispatchModal';
import MetricsModal from './components/MetricsModal';

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [units, setUnits] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [incidentsRes, unitsRes, metricsRes] = await Promise.all([
        axios.get('/incidents'),
        axios.get('/units'),
        axios.get('/metrics')
      ]);
      setIncidents(incidentsRes.data);
      setUnits(unitsRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleOpenDispatch = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const handleAssignUnit = async (unitId) => {
    if (!selectedIncident) return;
    try {
      await axios.post(`/incidents/${selectedIncident._id}/dispatch`, { unitId });
      setIsModalOpen(false);
      fetchData(); // Refresh immediately
    } catch (error) {
      alert('Failed to dispatch unit: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden font-inter">
      <Sidebar
        incidents={incidents}
        onDispatch={handleOpenDispatch}
        onShowMetrics={() => setIsMetricsOpen(true)}
      />
      <main className="flex-1 relative">
        <Map incidents={incidents} units={units} />
      </main>

      <DispatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incident={selectedIncident}
        units={units}
        onAssign={handleAssignUnit}
      />

      <MetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        metrics={metrics}
      />
    </div>
  );
}

export default App;
