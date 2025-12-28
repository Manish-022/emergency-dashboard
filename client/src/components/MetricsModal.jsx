import React from 'react';

const MetricsModal = ({ isOpen, onClose, metrics }) => {
    if (!isOpen || !metrics) return null;

    const formatTime = (ms) => {
        if (!ms) return 'N/A';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    };

    const maxCount = metrics.incidentsBySeverity
        ? Math.max(...metrics.incidentsBySeverity.map(i => i.count), 1)
        : 1;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-8 w-[600px] max-w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Performance Metrics</h2>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                        <h3 className="text-gray-400 text-sm uppercase">Total Incidents</h3>
                        <p className="text-3xl font-bold text-white">{metrics.totalIncidents}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                        <h3 className="text-gray-400 text-sm uppercase">Resolved</h3>
                        <p className="text-3xl font-bold text-green-400">{metrics.resolvedIncidents}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                        <h3 className="text-gray-400 text-sm uppercase">Avg Response</h3>
                        <p className="text-3xl font-bold text-blue-400">{formatTime(metrics.averageResponseTime)}</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-4">Incidents by Severity</h3>
                <div className="space-y-3 mb-8">
                    {metrics.incidentsBySeverity && metrics.incidentsBySeverity.map((item) => (
                        <div key={item._id} className="flex items-center gap-4">
                            <span className="w-16 text-sm text-gray-300 font-bold">{item._id}</span>
                            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item._id === 'High' ? 'bg-red-500' :
                                            item._id === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                                ></div>
                            </div>
                            <span className="w-8 text-right text-sm text-gray-400">{item.count}</span>
                        </div>
                    ))}
                    {(!metrics.incidentsBySeverity || metrics.incidentsBySeverity.length === 0) && (
                        <p className="text-gray-500 italic">No data yet</p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default MetricsModal;
