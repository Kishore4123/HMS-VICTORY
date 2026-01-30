// Firebase Configuration
// IMPORTANT: Replace these values with your Firebase project credentials
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your Firebase config - UPDATE THESE VALUES
const firebaseConfig = {
    apiKey: "AIzaSyBaA-wkSsMnDz5hDpeIj9B1bFJEEiM3UOA",
    authDomain: "drone-rescue-system.firebaseapp.com",
    databaseURL: "https://drone-rescue-system-default-rtdb.firebaseio.com",
    projectId: "drone-rescue-system",
    storageBucket: "drone-rescue-system.firebasestorage.app",
    messagingSenderId: "891859396445",
    appId: "1:891859396445:web:10351b69776babb7f9eab4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export database reference function
window.getLocationFromFirebase = function() {
    // Updated path to match your Firebase tree: 'drone_status'
    const locationRef = ref(database, 'drone_status'); 
    
    return new Promise((resolve, reject) => {
        onValue(locationRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                resolve({
                    // Updated keys to match 'lat', 'long', and 'type' from your image
                    lat: data.lat,
                    long: data.long,
                    type: data.type,
                    timestamp: data.timestamp || new Date().getTime()
                });
            } else {
                reject(new Error("Drone status data not found in Firebase"));
            }
        }, (error) => {
            reject(error);
        });
    });
};

// Real-time listener for location updates
window.listenToLocationUpdates = function(callback) {
    // Updated path to 'drone_status'
    const locationRef = ref(database, 'drone_status');
    
    onValue(locationRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            callback({
                lat: data.lat,
                long: data.long,
                type: data.type,
                timestamp: data.timestamp || new Date().getTime()
            });
        }
    }, (error) => {
        console.error("Firebase listener error:", error);
    });
};