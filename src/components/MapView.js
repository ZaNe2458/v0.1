const { useEffect, useRef } = React;

function MapView({ onMarkerClick }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize the map
        mapInstanceRef.current = L.map(mapRef.current).setView([47.9185, 106.917], 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Add markers for car wash locations
        if (window.carWashLocations) {
            window.carWashLocations.forEach((loc) => {
                // Create custom marker icon
                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: '<i class="fas fa-car-wash" style="color: white; font-size: 12px;"></i>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [0, -15]
                });

                const marker = L.marker([loc.latitude, loc.longitude], {
                    icon: customIcon
                }).addTo(mapInstanceRef.current);

                // Add click event
                marker.on('click', () => {
                    onMarkerClick(loc);
                });

                // Store marker reference
                markersRef.current.push(marker);

                // Add tooltip
                marker.bindTooltip(loc.name, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10]
                });
            });
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [onMarkerClick]);

    return <div ref={mapRef} className="map-container" />;
}

// Export component
window.MapView = MapView;
