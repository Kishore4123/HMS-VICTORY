# Live Direction Guide - Quad Copter Dash 🚁

A futuristic web-based cockpit control system and live direction guide for autonomous quad-copter simulation. This application provides a sophisticated HUD-inspired interface combining helicopter instrumentation aesthetics with real-time mapping and navigation.

## 🎮 Features

### Cockpit Console (Futuristic Home Page)
✨ **Advanced HUD Design** - Neon green (#00ff88) cockpit theme with authentic helicopter instrumentation  
✨ **Real-time System Monitoring** - Live altitude, battery, speed, heading displays  
✨ **Flight Mode Selection** - MANUAL, STABILIZE, AUTO, RTL modes  
✨ **Hardware Integration Buttons** - Camera, Gimbal, LiDAR modules (ready for hardware integration)  
✨ **Dynamic Gauges** - Rotor performance monitoring with live updates  
✨ **System Diagnostics** - Temperature, voltage, current, CPU usage, link quality  
✨ **Control Panel** - Power, Record, Calibrate, Emergency Stop buttons  
✨ **Connection Indicator** - Real-time GPS signal strength and system connectivity  

### Live Direction Guide (Map View)
🗺️ **Leaflet Maps Integration** - OpenStreetMap with interactive controls  
🗺️ **Real-time Location Tracking** - Browser Geolocation API with continuous updates  
🗺️ **Firebase Streaming** - Real-time target location from Firebase database  
🗺️ **Smart Route Calculation** - Leaflet Routing Machine with distance/duration estimation  
🗺️ **Live Dashboard** - Current location, target location, and route information  
🗺️ **Back Navigation** - Easy return to cockpit console  

## 📁 File Structure

```
Quad-Copter's Dash/
├── home.html              # Main cockpit console (futuristic UI)
├── index.html             # Map view with live directions
├── cockpit.css            # Cockpit styling (HUD theme)
├── style.css              # Map view styling
├── cockpit.js             # Cockpit functionality & hardware integration
├── app.js                 # Map view logic
├── firebase-config.js     # Firebase configuration & real-time listeners
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Prerequisites
- Modern browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for serving)
- Firebase account with Realtime Database

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select project: `drone-rescue-system`
3. Set up Realtime Database with following structure:
```json
{
  "drone_status": {
    "lat": 40.7128,
    "long": -74.0060,
    "timestamp": 1234567890
  }
}
```

4. Firebase config is pre-configured in `firebase-config.js`:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBaA-wkSsMnDz5hDpeIj9B1bFJEEiM3UOA",
    authDomain: "drone-rescue-system.firebaseapp.com",
    databaseURL: "https://drone-rescue-system-default-rtdb.firebaseio.com",
    projectId: "drone-rescue-system",
    storageBucket: "drone-rescue-system.appspot.com",
    messagingSenderId: "891859396445",
    appId: "1:891859396445:web:10351b69776babb7f9eab4"
};
```

### 3. Run Local Server

**Python:**
```bash
cd "Quad-Copter's Dash"
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server
```

**VS Code Live Server:**
Right-click `home.html` → "Open with Live Server"

### 4. Access Application
Open browser and go to: **http://localhost:8000/home.html**

## 🎮 How to Use

### Cockpit Console
1. **Power On** - Click ⚡ PWR button to activate the system
2. **Select Flight Mode** - Choose MANUAL, STABILIZE, AUTO, or RTL
3. **Activate Hardware** - Enable Camera, Gimbal, or LiDAR modules
4. **Monitor Sensors** - Watch real-time altitude, speed, battery status
5. **Record Flight** - Click ⏺️ REC to start recording (requires power)
6. **Calibrate** - Click ⚙️ CAL to calibrate IMU sensors
7. **Emergency Stop** - Red button for emergency shutdown

### Map Navigation
1. **Open Map** - Click 🗺️ MAP VIEW from cockpit
2. **View Route** - Automatic route calculation from your location to target
3. **Monitor Direction** - Watch distance and ETA to destination
4. **Return to Cockpit** - Click ⬅ COCKPIT button

## 🔧 Hardware Integration Points

The cockpit includes dummy hardware buttons ready for integration:

### Camera Module (`toggleCamera()`)
```javascript
if (cameraActive) {
    // Connect to camera hardware via API
    // Stream video from camera
}
```

### Gimbal Control (`toggleGimbal()`)
```javascript
if (gimbalActive) {
    // Control gimbal pan/tilt/roll
    // Receive gimbal telemetry
}
```

### LiDAR Sensor (`toggleLidar()`)
```javascript
if (lidarActive) {
    // Activate LiDAR scanning
    // Process distance data
}
```

## 📊 Real-time Displays

### System Status
- **Altitude** - Current height above ground (m)
- **Battery** - Battery percentage with color coding
- **Speed** - Current velocity (km/h)
- **Heading** - Compass direction (0-360°)

### Diagnostics
- **Rotor Performance** - Individual rotor power levels (1-4)
- **Temperature** - System temperature (°C)
- **Voltage** - Battery voltage (V)
- **Current** - Power consumption (A)
- **CPU Usage** - Processor load (%)
- **Link Quality** - Signal strength (%)

### Flight Data
- **Uptime** - System operational time
- **Flight Time** - Current flight duration
- **Distance** - Total distance traveled
- **GPS Satellites** - Connected satellite count

## 🎨 UI Theme

**Color Palette:**
- Primary: `#00ff88` (Neon Green)
- Secondary: `#00ccff` (Cyan)
- Accent: `#ff6b6b` (Red - Emergency)
- Warning: `#ffff00` (Yellow)
- Background: `#0a0e27` (Deep Navy)

**Visual Effects:**
- Scanline animation
- Neon glow effects
- Pulsing indicators
- Holographic elements

## 🔐 Security Notes

**Current Setup:**
- Firebase rules set to allow all read/write
- ⚠️ **Development Only** - Not for production

**Production Setup:**
```json
{
  "rules": {
    "drone_status": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).exists()"
    }
  }
}
```

## 🐛 Troubleshooting

### Map not loading
- Ensure server is running via HTTP (not `file://`)
- Check browser console for errors (F12)
- Verify Leaflet library is loaded

### Firebase connection failed
- Verify Firebase credentials in `firebase-config.js`
- Check database structure matches expected path
- Test with Firebase console

### Location access denied
- Grant browser location permission
- Use HTTPS for production
- Check device location services enabled

### Hardware buttons not responding
- Ensure power is ON first
- Check browser console for JavaScript errors
- Verify button functions are defined

## 📱 Responsive Design

- **Desktop** - Full 3-column layout with all features
- **Tablet** - Adjusted grid layout
- **Mobile** - Single column with optimized spacing

## 🔌 API Integration

### Firebase Real-time Updates
```javascript
window.listenToLocationUpdates((location) => {
    // location.lat
    // location.long
    // location.timestamp
});
```

### Geolocation API
```javascript
navigator.geolocation.watchPosition((position) => {
    // position.coords.lat
    // position.coords.long
    // position.coords.accuracy
});
```

### Leaflet Routing
```javascript
L.Routing.control({
    waypoints: [currentLocation, targetLocation]
}).addTo(map);
```

## 📝 Customization

### Change Colors
Edit `cockpit.css` and `style.css`:
- Primary green: `#00ff88` → your color
- Cyan: `#00ccff` → your color
- Red: `#ff6b6b` → your color

### Add New Buttons
Add to HTML and create corresponding JavaScript functions:
```javascript
function toggleNewHardware() {
    // Implementation
}
```

### Modify Update Intervals
In `cockpit.js`:
```javascript
setInterval(updateDynamicValues, 500); // Change 500ms interval
```

## 🚀 Future Enhancements

- [ ] Real hardware integration with serial communication
- [ ] WebSocket for low-latency updates
- [ ] Advanced flight data logging
- [ ] 3D visualization
- [ ] Multi-drone support
- [ ] Obstacle avoidance visualization
- [ ] Weather data integration
- [ ] Mission planning interface

## 📄 License

Free to use and modify for personal and commercial projects.

## 🆘 Support

Issues? Check:
1. Browser console (F12 → Console tab)
2. Network tab for failed requests
3. Firebase console for database errors
4. Terminal for server logs

---

**Version:** 3.2.1-NEXUS  
**Last Updated:** January 2026  
**Built with:** Leaflet, Firebase, HTML5, CSS3, JavaScript
