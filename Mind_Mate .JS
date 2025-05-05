document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1;
    let totalWater = 0;
    let prevCoords = null;
    let totalSteps = 0;
    let userData = {};

    const pages = {
        1: createProfilePage,
        2: createMoodPage,
        3: createGoalsPage,
        4: createEmergencyPage
    };

    function renderPage(pageNum) {
        document.body.innerHTML = "";
        pages[pageNum]();
        currentPage = pageNum;
    }

    function createProfilePage() {
        document.body.innerHTML = `
            <h2>Step 1: Profile</h2>
            <input type="text" id="name" placeholder="Enter your name">
            <label for="gender">Select gender:</label>
            <select id="gender">
                <option value="">-- Select --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <input type="number" id="age" placeholder="Age">
            <input type="number" id="weight" placeholder="Weight (kg)">
            <input type="number" id="height" placeholder="Height (cm)">
            <button id="calcBMI">Calculate BMI</button>
            <div id="bmiResult"></div>
            <button id="next">Next ➡️</button>
        `;

        document.getElementById("calcBMI").addEventListener("click", calculateBMI);
        document.getElementById("next").addEventListener("click", () => renderPage(2));
    }

    function calculateBMI() {
        let weight = parseFloat(document.getElementById("weight").value);
        let heightCm = parseFloat(document.getElementById("height").value);
        if (!isNaN(weight) && !isNaN(heightCm) && weight > 0 && heightCm > 0) {
            let heightM = heightCm / 100;
            let bmi = (weight / (heightM * heightM)).toFixed(2);
            document.getElementById("bmiResult").innerText = Your BMI: ${bmi};
        } else {
            document.getElementById("bmiResult").innerText = ⚠️ Enter valid weight & height!;
        }
    }

    function createMoodPage() {
        document.body.innerHTML = `
            <h2>Step 2: Mood of the Day</h2>
            <p>Select your mood:</p>
            <button id="sleepy">🥴 Sleepy</button>
            <button id="active">😀 Active</button>
            <button id="normal">😐 Normal</button>
            <div id="moodDisplay"></div>
            <button id="next">Next ➡️</button>
        `;

        document.getElementById("sleepy").addEventListener("click", () => updateMood("Sleepy", "🥴"));
        document.getElementById("active").addEventListener("click", () => updateMood("Active", "😀"));
        document.getElementById("normal").addEventListener("click", () => updateMood("Normal", "😐"));
        document.getElementById("next").addEventListener("click", () => renderPage(3));
    }

    function updateMood(mood, emoji) {
        document.getElementById("moodDisplay").innerText = You are feeling ${mood.toUpperCase()} ${emoji};
    }

    function createGoalsPage() {
        document.body.innerHTML = `
            <h2>Step 3: Daily Goals</h2>
            <h3>🚶 Steps (GPS Tracking)</h3>
            <button id="startTracking">Start GPS Tracker</button>
            <div id="stepCounter">Steps: 0</div>
            
            <h3>💧 Water Intake</h3>
            <input type="number" id="waterInput" placeholder="Enter water (ml)">
            <button id="addWater">Add</button>
            <div id="waterResult">Total: 0 ml</div>
            
            <h3>🛌 Sleep</h3>
            <label>Sleep Time:</label>
            <input type="time" id="sleepTime">
            <label>Wake Time:</label>
            <input type="time" id="wakeTime">
            <button id="calculateSleep">Calculate Sleep</button>
            <div id="sleepResult"></div>

            <button id="next">Next ➡️</button>
        `;

        document.getElementById("startTracking").addEventListener("click", startTracking);
        document.getElementById("addWater").addEventListener("click", addWater);
        document.getElementById("calculateSleep").addEventListener("click", calculateSleep);
        document.getElementById("next").addEventListener("click", () => renderPage(4));
    }

    function addWater() {
        let input = parseInt(document.getElementById("waterInput").value);
        if (!isNaN(input)) {
            totalWater += input;
            document.getElementById("waterResult").innerText = Total: ${totalWater} ml;
        }
    }

    function calculateSleep() {
        let sleepTime = document.getElementById("sleepTime").value;
        let wakeTime = document.getElementById("wakeTime").value;
        if (sleepTime && wakeTime) {
            let [sh, sm] = sleepTime.split(':').map(Number);
            let [wh, wm] = wakeTime.split(':').map(Number);
            let sleepMinutes = ((wh * 60 + wm) - (sh * 60 + sm));
            if (sleepMinutes < 0) sleepMinutes += 1440;
            let hours = (sleepMinutes / 60).toFixed(1);
            document.getElementById("sleepResult").innerText = You slept ${hours} hours;
        }
    }

    function startTracking() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(position => {
                let { latitude, longitude } = position.coords;
                if (prevCoords) {
                    let distance = getDistance(prevCoords.lat, prevCoords.lon, latitude, longitude);
                    totalSteps += Math.round(distance / 0.8);
                    document.getElementById("stepCounter").innerText = Steps: ${totalSteps};
                }
                prevCoords = { lat: latitude, lon: longitude };
            });
        } else {
            alert("Geolocation not supported!");
        }
    }

    function createEmergencyPage() {
        document.body.innerHTML = `
            <h2>Step 4: Emergency Contact</h2>
            <input type="tel" id="emergencyContact" placeholder="Enter emergency contact">
            <button id="saveEmergency">Save Contact</button>
            <div id="emergencyDisplay"></div>
        `;
    }

    renderPage(1);
});