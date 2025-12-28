import React from 'react';

const DispatchModal = ({ isOpen, onClose, incident, units, onAssign }) => {
    if (!isOpen || !incident) return null;

    const availableUnits = units.filter(u => u.status === 'Idle');

    // Sort units by distance? For now just list them.
    // Ideally we calculate distance, but let's just show types matching incident type if possible or just all idle.

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 w-96 max-w-full shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Dispatch Unit</h2>
                <p className="text-gray-400 mb-4 text-sm">Incident: {incident.type} at {incident.description}</p>

                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                    {availableUnits.length === 0 ? (
                        <p className="text-red-400 font-bold text-center">No units available!</p>
                    ) : (
                        availableUnits.map(unit => (
                            <button
                                key={unit._id}
                                onClick={() => onAssign(unit._id)}
                                className="w-full flex justify-between items-center p-3 rounded-lg bg-gray-700 hover:bg-blue-600 transition-colors text-white"
                            >
                                <span className="font-bold">{unit.name}</span>
                                <span className="text-xs uppercase bg-black/20 px-2 py-1 rounded">{unit.type}</span>
                            </button>
                        ))
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2 text-gray-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DispatchModal;
