// Debug function to check Firebase status
function checkFirebaseStatus() {
    const status = {
        app: !!window.firebaseApp,
        db: !!window.firebaseDb,
        ref: !!window.firebaseRef,
        set: !!window.firebaseSet,
        update: !!window.firebaseUpdate,
        push: !!window.firebasePush,
        remove: !!window.firebaseRemove,
    };
    
    console.log("=== FIREBASE STATUS ===");
    console.log("App:", status.app ? "✓" : "✗");
    console.log("Database:", status.db ? "✓" : "✗");
    console.log("Ref:", status.ref ? "✓" : "✗");
    console.log("Set:", status.set ? "✓" : "✗");
    console.log("Update:", status.update ? "✓" : "✗");
    console.log("Push:", status.push ? "✓" : "✗");
    console.log("Remove:", status.remove ? "✓" : "✗");
    console.log("========================");
    
    return Object.values(status).every(v => v === true);
}

// Make it globally accessible for debugging in console
window.checkFirebaseStatus = checkFirebaseStatus;

// Global state
let isPowerOn = false;
let isRecording = false;
let cameraActive = false;
let gimbalActive = false;
let lidarActive = false;
let systemUptime = 0;

// Firebase objects will be injected from HTML
let db;
let ref;
let set;
let update;
let push;
let remove;

// Wait for Firebase to be ready
function initializeFirebase() {
    if (window.firebaseDb && window.firebaseRef && window.firebaseSet) {
        console.log("✓ Firebase initialized successfully");
        db = window.firebaseDb;
        ref = window.firebaseRef;
        set = window.firebaseSet;
        update = window.firebaseUpdate;
        push = window.firebasePush;
        remove = window.firebaseRemove;
    } else {
        console.log("Waiting for Firebase to initialize...");
        setTimeout(initializeFirebase, 100);
    }
}

// Update Engine Status in Firebase
function updateEngineStatus(newValue) {
    console.log("updateEngineStatus called with value:", newValue);
    
    // Check if Firebase objects are available
    if (!window.firebaseDb) {
        console.error("✗ Firebase DB not available");
        return;
    }
    if (!window.firebaseRef) {
        console.error("✗ Firebase ref function not available");
        return;
    }
    if (!window.firebaseSet) {
        console.error("✗ Firebase set function not available");
        return;
    }
    
    try {
        const statusValue = newValue ? 1 : 0;
        console.log("Converting power state to Firebase value:", statusValue);
        console.log("Creating reference to 'Engine' path...");
        
        const engineRef = window.firebaseRef(window.firebaseDb, 'Engine');
        console.log("Reference created successfully");
        
        console.log("Calling set() to update Firebase...");
        window.firebaseSet(engineRef, statusValue)
            .then(() => {
                console.log("✓✓✓ SUCCESS: Engine status updated in Firebase to:", statusValue);
            })
            .catch((error) => {
                console.error("✗✗✗ FIREBASE ERROR:", error.code, "-", error.message);
            });
    } catch (error) {
        console.error("✗ Exception in updateEngineStatus:", error.message);
        console.error("Stack:", error.stack);
    }
}

// Update Flight Mode in Firebase
function updateFlightMode(mode) {
    console.log("updateFlightMode called with mode:", mode);
    
    // Check if Firebase objects are available
    if (!window.firebaseDb) {
        console.error("✗ Firebase DB not available");
        return;
    }
    if (!window.firebaseRef) {
        console.error("✗ Firebase ref function not available");
        return;
    }
    if (!window.firebaseSet) {
        console.error("✗ Firebase set function not available");
        return;
    }
    
    try {
        console.log("Creating reference to 'FlightMode' path...");
        const flightModeRef = window.firebaseRef(window.firebaseDb, 'FlightMode');
        console.log("Reference created successfully");
        
        console.log("Calling set() to update Firebase with mode:", mode);
        window.firebaseSet(flightModeRef, mode)
            .then(() => {
                console.log("✓✓✓ SUCCESS: Flight Mode updated in Firebase to:", mode);
            })
            .catch((error) => {
                console.error("✗✗✗ FIREBASE ERROR:", error.code, "-", error.message);
            });
    } catch (error) {
        console.error("✗ Exception in updateFlightMode:", error.message);
        console.error("Stack:", error.stack);
    }
}

// Update time display
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('timeDisplay').textContent = `${hours}:${minutes}:${seconds}`;
}

// Update uptime
function updateUptime() {
    systemUptime++;
    const hours = Math.floor(systemUptime / 3600);
    const minutes = Math.floor((systemUptime % 3600) / 60);
    const seconds = systemUptime % 60;
    document.getElementById('uptimeValue').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Simulate dynamic values
function updateDynamicValues() {
    if (!isPowerOn) return;
    
    // Simulate altitude (random variation)
    const altitude = (Math.random() * 150 + 20).toFixed(1);
    document.getElementById('altitudeValue').textContent = altitude;
    
    // Simulate battery discharge
    let battery = parseInt(document.getElementById('batteryValue').textContent);
    battery = Math.max(0, battery - Math.random() * 0.05);
    document.getElementById('batteryValue').textContent = battery.toFixed(1) + '%';
    document.getElementById('batteryFill').style.width = battery + '%';
    
    // Update battery color based on level
    const batteryFill = document.getElementById('batteryFill');
    if (battery > 60) {
        batteryFill.style.background = 'linear-gradient(90deg, #00ff88 0%, #00ccff 100%)';
    } else if (battery > 30) {
        batteryFill.style.background = 'linear-gradient(90deg, #ffff00 0%, #ff9900 100%)';
    } else {
        batteryFill.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ff0000 100%)';
    }
    
    // Simulate speed
    const speed = (Math.random() * 80 + 5).toFixed(1);
    document.getElementById('speedValue').textContent = speed;
    
    // Simulate heading
    const heading = Math.floor(Math.random() * 360);
    document.getElementById('headingIndicator').textContent = heading + '°';
    document.getElementById('compassNeedle').style.transform = `rotate(${heading}deg)`;
    
    // Simulate flight time
    const flightTimeEl = document.getElementById('flightTime');
    let [min, sec] = flightTimeEl.textContent.split(':').map(Number);
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
    }
    flightTimeEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    
    // Simulate distance
    const distanceEl = document.getElementById('distanceTraveled');
    let distance = parseFloat(distanceEl.textContent) + (Math.random() * 0.015);
    distanceEl.textContent = distance.toFixed(2);
    
    // Simulate temperature
    const temp = (35 + Math.random() * 15).toFixed(0);
    document.getElementById('tempValue').textContent = temp + '°C';
    
    // Simulate voltage
    const voltage = (11.8 + Math.random() * 0.8).toFixed(1);
    document.getElementById('voltageValue').textContent = voltage + 'V';
    
    // Simulate current
    const current = (3 + Math.random() * 6).toFixed(1);
    document.getElementById('currentValue').textContent = current + 'A';
    
    // Simulate CPU usage
    const cpu = Math.floor(30 + Math.random() * 40);
    document.getElementById('cpuUsage').textContent = cpu + '%';
    
    // Simulate link quality
    const linkQuality = Math.floor(90 + Math.random() * 10);
    document.getElementById('linkQuality').textContent = linkQuality + '%';
    
    // Simulate signal strength
    const signalBars = Math.floor(Math.random() * 5) + 1;
    document.getElementById('signalBars').textContent = '●'.repeat(signalBars) + '○'.repeat(5 - signalBars);
}

// Toggle Power
function togglePower() {
    isPowerOn = !isPowerOn;
    const powerBtn = document.getElementById('powerBtn');
    const systemStatus = document.getElementById('systemStatus');
    
    console.log("Power toggle clicked. New state:", isPowerOn);
    
    // --- Update Firebase ---
    updateEngineStatus(isPowerOn); 
    // ----------------------------

    if (isPowerOn) {
        powerBtn.style.background = 'linear-gradient(135deg, rgba(0, 255, 136, 0.4) 0%, rgba(0, 204, 255, 0.4) 100%)';
        powerBtn.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.6)';
        systemStatus.textContent = '⚡ SYSTEM POWERED ON';
        systemStatus.style.color = '#00ff88';
    } else {
        powerBtn.style.background = 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 255, 0.1) 100%)';
        powerBtn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
        systemStatus.textContent = 'SYSTEM OFFLINE';
        systemStatus.style.color = '#ff6b6b';
        // Reset dynamic values
        document.getElementById('altitudeValue').textContent = '0.0';
        document.getElementById('speedValue').textContent = '0.0';
    }
}
// Toggle Record
function toggleRecord() {
    if (!isPowerOn) {
        alert('Power on the system first!');
        return;
    }
    
    isRecording = !isRecording;
    const recordBtn = document.getElementById('recordBtn');
    
    if (isRecording) {
        recordBtn.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.4) 0%, rgba(255, 0, 0, 0.4) 100%)';
        recordBtn.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.6)';
        recordBtn.style.borderColor = '#ff6b6b';
        recordBtn.style.color = '#ff6b6b';
        recordBtn.innerHTML = '<span class="btn-icon">⏸️</span> STOP';
    } else {
        recordBtn.style.background = 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 255, 0.1) 100%)';
        recordBtn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
        recordBtn.style.borderColor = '#00ff88';
        recordBtn.style.color = '#00ff88';
        recordBtn.innerHTML = '<span class="btn-icon">⏺️</span> REC';
    }
}

// Calibrate System
function calibrate() {
    if (!isPowerOn) {
        alert('Power on the system first!');
        return;
    }
    
    const calibrateBtn = document.getElementById('calibrateBtn');
    calibrateBtn.disabled = true;
    calibrateBtn.innerHTML = '<span class="btn-icon">⏳</span> CAL';
    
    setTimeout(() => {
        calibrateBtn.disabled = false;
        calibrateBtn.innerHTML = '<span class="btn-icon">✓</span> CAL';
        setTimeout(() => {
            calibrateBtn.innerHTML = '<span class="btn-icon">⚙️</span> CAL';
        }, 1500);
    }, 2000);
}

// Emergency Stop
function emergencyStop() {
    if (confirm('EMERGENCY STOP ACTIVATED! Are you sure?')) {
        isPowerOn = false;
        isRecording = false;
        cameraActive = false;
        gimbalActive = false;
        lidarActive = false;
        
        const statusIndicator = document.getElementById('statusIndicator');
        statusIndicator.textContent = '● EMERGENCY STOP';
        statusIndicator.style.color = '#ff6b6b';
        statusIndicator.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
        statusIndicator.style.borderColor = '#ff6b6b';
        
        document.getElementById('systemStatus').textContent = '🚨 EMERGENCY STOP ACTIVATED';
        document.getElementById('systemStatus').style.color = '#ff6b6b';
        
        // Reset all displays
        updatePowerDisplay();
    }
}

// Update power display state
function updatePowerDisplay() {
    const powerBtn = document.getElementById('powerBtn');
    if (isPowerOn) {
        powerBtn.style.background = 'linear-gradient(135deg, rgba(0, 255, 136, 0.4) 0%, rgba(0, 204, 255, 0.4) 100%)';
    } else {
        powerBtn.style.background = 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 255, 0.1) 100%)';
    }
}

// Toggle Camera (Hardware)
function toggleCamera() {
    if (!isPowerOn) {
        alert('Power on the system first!');
        return;
    }
    
    cameraActive = !cameraActive;
    const cameraBtn = document.getElementById('cameraBtn');
    
    if (cameraActive) {
        cameraBtn.classList.add('active');
        cameraBtn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
    } else {
        cameraBtn.classList.remove('active');
        cameraBtn.style.boxShadow = 'none';
    }
}

// Toggle Gimbal (Hardware)
function toggleGimbal() {
    if (!isPowerOn) {
        alert('Power on the system first!');
        return;
    }
    
    gimbalActive = !gimbalActive;
    const gimbalBtn = document.getElementById('gimbalBtn');
    
    if (gimbalActive) {
        gimbalBtn.classList.add('active');
        gimbalBtn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
    } else {
        gimbalBtn.classList.remove('active');
        gimbalBtn.style.boxShadow = 'none';
    }
}

// Toggle LiDAR (Hardware)
function toggleLidar() {
    if (!isPowerOn) {
        alert('Power on the system first!');
        return;
    }
    
    lidarActive = !lidarActive;
    const lidarBtn = document.getElementById('lidarBtn');
    
    if (lidarActive) {
        lidarBtn.classList.add('active');
        lidarBtn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
    } else {
        lidarBtn.classList.remove('active');
        lidarBtn.style.boxShadow = 'none';
    }
}

// Navigate to Map
function navigateToMap() {
    window.location.href = 'index.html';
}

// Open Video Feed (Dummy)
function openVideoFeed() {
    if (!isPowerOn || !cameraActive) {
        alert('Power on the system and activate camera first!');
        return;
    }
    alert('📹 Video Feed Opening...\n\nNote: Camera module is active. In a real implementation, this would open a live video stream.');
}

// Set Flight Mode
function setFlightMode(mode) {
    if (!isPowerOn) {
        alert('Power on the system first!');
        return;
    }
    
    // Remove active class from all buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Update Firebase with the new flight mode
    console.log("Flight mode changed to:", mode);
    updateFlightMode(mode);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
    updateTime();
    setInterval(updateTime, 1000);
    
    setInterval(updateUptime, 1000);
    
    setInterval(updateDynamicValues, 500);
    
    // Add some initial rotor animation
    animateRotors();
    
    // Debug: Check Firebase status
    console.log("=== FIREBASE INITIALIZATION CHECK ===");
    setTimeout(() => {
        console.log("Firebase App:", window.firebaseApp ? "✓ Available" : "✗ Not available");
        console.log("Firebase DB:", window.firebaseDb ? "✓ Available" : "✗ Not available");
        console.log("Firebase ref:", window.firebaseRef ? "✓ Available" : "✗ Not available");
        console.log("Firebase set:", window.firebaseSet ? "✓ Available" : "✗ Not available");
        console.log("Local db:", db ? "✓ Available" : "✗ Not available");
        console.log("Local ref:", ref ? "✓ Available" : "✗ Not available");
        console.log("Local set:", set ? "✓ Available" : "✗ Not available");
        console.log("====================================");
    }, 1000);
});

// Animate rotors
function animateRotors() {
    const rotors = document.querySelectorAll('.gauge-fill');
    rotors.forEach((rotor, index) => {
        const animation = setInterval(() => {
            if (!isPowerOn) return;
            const currentWidth = parseFloat(rotor.style.width);
            const variation = (Math.random() - 0.5) * 10;
            const newWidth = Math.max(60, Math.min(95, currentWidth + variation));
            rotor.style.width = newWidth + '%';
        }, 1000);
    });
}

// Add click feedback
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 136, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Note: This is simplified, actual ripple positioning would need more work
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // You could add a confirmation dialog here
    }
});

window.togglePower = togglePower;
window.emergencyStop = emergencyStop;
