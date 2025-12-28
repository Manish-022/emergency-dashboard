import React from 'react';

const Sidebar = ({ incidents, onDispatch, onShowMetrics }) => {
    const getSeverityColor = (severity) => {
        // High contrast colors for visibility
        const s = severity ? severity.toLowerCase() : '';
        if (s === 'high') return 'bg-red-600 text-white border-4 border-red-400';
        if (s === 'medium') return 'bg-orange-600 text-white border-4 border-orange-400';
        if (s === 'low') return 'bg-blue-600 text-white border-4 border-blue-400';

        return 'bg-gray-700 text-gray-300 border-4 border-gray-500';
    };

    return (
        <div className="h-full bg-gray-900/95 backdrop-blur-md p-4 overflow-y-auto border-r border-gray-700 w-96 flex-shrink-0 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Active Incidents</h2>
                <button
                    onClick={onShowMetrics}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-300"
                >
                    Metrics
                </button>
            </div>
            <div className="space-y-4 flex-1">
                {incidents.length === 0 ? (
                    <p className="text-gray-400 text-center py-10">No active incidents</p>
                ) : (
                    [...incidents]
                        .sort((a, b) => {
                            const priority = { 'High': 3, 'Medium': 2, 'Low': 1 };
                            return (priority[b.severity] || 0) - (priority[a.severity] || 0);
                        })
                        .map((incident) => (
                            <div
                                key={incident._id}
                                className={`p-4 rounded-xl border ${getSeverityColor(incident.severity)} transition-all hover:scale-[1.02] cursor-pointer`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-lg">{incident.type}</span>
                                    <span className="text-xs uppercase font-bold px-2 py-1 rounded bg-black/30">{incident.status}</span>
                                </div>
                                <p className="text-sm mb-3 opacity-90">{incident.description}</p>

                                {incident.status === 'Reported' && (
                                    <button
                                        onClick={() => onDispatch(incident)}
                                        className="w-full py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                                    >
                                        Dispatch Unit
                                    </button>
                                )}
                                {incident.status === 'Assigned' && (
                                    <div className="text-sm text-green-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        Unit Assigned
                                    </div>
                                )}
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;
