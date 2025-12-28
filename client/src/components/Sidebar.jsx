import React from 'react';

const Sidebar = ({ incidents, onDispatch, onShowMetrics, isOpen, onClose }) => {
    const getSeverityColor = (severity) => {
        // High contrast colors for visibility
        const s = severity ? severity.toLowerCase() : '';
        if (s === 'high') return 'bg-red-600 text-white border-4 border-red-400';
        if (s === 'medium') return 'bg-orange-600 text-white border-4 border-orange-400';
        if (s === 'low') return 'bg-sky-600 text-white border-4 border-sky-400';

        return 'bg-gray-700 text-gray-300 border-4 border-gray-500';
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed md:relative inset-y-0 left-0 z-[2000]
                w-80 md:w-96
                bg-gray-900/95 backdrop-blur-md 
                border-r border-gray-700
                flex flex-col
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Active Incidents</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                onShowMetrics();
                                onClose();
                            }}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-300"
                        >
                            Metrics
                        </button>
                        {/* Mobile Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 md:hidden text-gray-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDispatch(incident);
                                                if (window.innerWidth < 768) {
                                                    onClose();
                                                }
                                            }}
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
        </>
    );
};

export default Sidebar;
