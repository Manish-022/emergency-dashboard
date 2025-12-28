import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons (using DivIcon for better styling later if needed, but standard for now with color filters)
// Custom Icons using SVG Data URIs to avoid network issues
const getIcon = (color) => {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="${color}">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>`;

    return new L.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
        shadowUrl: null // No shadow for simple SVG
    });
};

const getSeverityColor = (severity) => {
    const s = severity ? severity.toLowerCase() : '';
    switch (s) {
        case 'high': return 'red';
        case 'medium': return 'orange';
        case 'low': return 'blue';
        default: return 'blue';
    }
}

const Map = ({ incidents, units }) => {
    const defaultPosition = [40.7128, -74.0060]; // NYC Default

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark mode map tiles
                />
                {incidents.map((inc) => (
                    <Marker
                        key={inc._id}
                        position={[inc.location.coordinates[1], inc.location.coordinates[0]]}
                        icon={getIcon(getSeverityColor(inc.severity))}
                    >
                        <Popup>
                            <div className="text-sm">
                                <h3 className="font-bold">{inc.type} ({inc.severity})</h3>
                                <p>{inc.description}</p>
                                <p>Status: {inc.status}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {units.map((unit) => (
                    <Marker
                        key={unit._id}
                        position={[unit.location.coordinates[1], unit.location.coordinates[0]]}
                        opacity={0.8}
                        icon={getIcon('green')}
                    >
                        <Popup>
                            <div className="text-sm">
                                <h3 className="font-bold">{unit.name} ({unit.type})</h3>
                                <p>Status: {unit.status}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
