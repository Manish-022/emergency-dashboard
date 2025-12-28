import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import DispatchModal from './components/DispatchModal';
import MetricsModal from './components/MetricsModal';

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://emergency-dashboard-server.onrender.com/api';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [units, setUnits] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ... (keep fetchData and useEffect)

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
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden font-inter relative">

      {/* Mobile Menu Button - Only visible on small screens */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden absolute top-4 left-4 z-10 p-2 bg-gray-900/90 rounded-lg text-white shadow-lg border border-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Sidebar
        incidents={incidents}
        onDispatch={handleOpenDispatch}
        onShowMetrics={() => setIsMetricsOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 relative w-full h-full">
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
