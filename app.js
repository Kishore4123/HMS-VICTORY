// Global Variables
let map;
let currentLocation = { lat: 51.505, lng: -0.09 }; // Default: London
let targetLocation = { lat: null, lng: null };
let currentMarker;
let targetMarker;
let routingControl;
let watchId;

// Initialize map on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    startLocationTracking();
    listenToFirebaseUpdates();
    setupEventListeners();
    updateStatusMessage('Initializing...', 'active');
});

// Initialize Leaflet Map
function initializeMap() {
    map = L.map('map').setView([currentLocation.lat, currentLocation.lng], 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 1
    }).addTo(map);
    
    // Add current location marker
    currentMarker = L.circleMarker([currentLocation.lat, currentLocation.lng], {
        radius: 8,
        fillColor: '#667eea',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    })
    .bindPopup('<b>Current Location</b>')
    .addTo(map);
    
    updateLocationDisplay('current', currentLocation);
}

// Get current location from browser
function startLocationTracking() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Update marker
                if (currentMarker) {
                    currentMarker.setLatLng([currentLocation.lat, currentLocation.lng]);
                }
                
                updateLocationDisplay('current', currentLocation);
                updateStatusMessage('Tracking location...', 'active');
                
                // Update route if target exists
                if (targetLocation.lat && targetLocation.lng) {
                    updateRoute();
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                updateStatusMessage('Location access denied. Using default location.', 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        updateStatusMessage('Geolocation not supported in this browser', 'error');
    }
}

// Listen to Firebase database for target location updates
function listenToFirebaseUpdates() {
    try {
        window.listenToLocationUpdates((location) => {
            targetLocation = {
                lat: location.latitude,
                lng: location.longitude
            };
            
            updateLocationDisplay('target', targetLocation);
            updateStatusMessage('Target location updated', 'active');
            
            // Add or update target marker
            if (targetMarker) {
                targetMarker.setLatLng([targetLocation.lat, targetLocation.lng]);
            } else {
                targetMarker = L.circleMarker([targetLocation.lat, targetLocation.lng], {
                    radius: 10,
                    fillColor: '#e74c3c',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                })
                .bindPopup('<b>Target Location</b>')
                .addTo(map);
            }
            
            // Update route
            updateRoute();
        });
    } catch (error) {
        console.error('Firebase error:', error);
        updateStatusMessage('Firebase connection failed: ' + error.message, 'error');
    }
}

// Update route between current and target locations
function updateRoute() {
    if (!currentLocation.lat || !targetLocation.lat) {
        return;
    }
    
    // Remove existing route
    if (routingControl) {
        map.removeControl(routingControl);
    }
    
    // Create routing control
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(currentLocation.lat, currentLocation.lng),
            L.latLng(targetLocation.lat, targetLocation.lng)
        ],
        routeWhileDragging: false,
        lineOptions: {
            styles: [
                { color: '#667eea', opacity: 0.8, weight: 5, lineCap: 'round', lineJoin: 'round' }
            ]
        },
        createMarker: () => null // Disable routing machine markers, we use our own
    }).addTo(map);
    
    // Handle route results
    routingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2);
        const duration = Math.round(route.summary.totalTime / 60);
        
        document.getElementById('distance').textContent = distance;
        document.getElementById('duration').textContent = duration;
        document.getElementById('routeStatus').textContent = 'Route calculated';
        
        // Fit map to bounds
        const bounds = L.latLngBounds(
            [currentLocation.lat, currentLocation.lng],
            [targetLocation.lat, targetLocation.lng]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
    });
    
    routingControl.on('routeserror', (e) => {
        console.error('Routing error:', e);
        document.getElementById('routeStatus').textContent = 'Route calculation failed';
        updateStatusMessage('Could not calculate route', 'error');
    });
}

// Update location display in sidebar
function updateLocationDisplay(type, location) {
    if (type === 'current') {
        document.getElementById('currentLat').textContent = location.lat.toFixed(6);
        document.getElementById('currentLng').textContent = location.lng.toFixed(6);
    } else if (type === 'target') {
        document.getElementById('targetLat').textContent = location.lat.toFixed(6);
        document.getElementById('targetLng').textContent = location.lng.toFixed(6);
    }
}

// Update status message
function updateStatusMessage(message, status = 'normal') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + status;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('recenterBtn').addEventListener('click', () => {
        if (currentLocation.lat && currentLocation.lng) {
            map.setView([currentLocation.lat, currentLocation.lng], 15);
        }
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
});
