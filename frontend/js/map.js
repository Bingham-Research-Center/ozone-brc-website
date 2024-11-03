/* global L */  // Tell WebStorm that L comes from Leaflet library

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeMap);

// Initialize map
let map;
const stationMarkers = {};

// Define custom icon creators for each air quality level
const createCustomIcon = (category) => {
    // Map category to actual image names from the prototype
    const categoryToImage = {
        'good': 'GOOD',
        'moderate': 'moderate',
        'unhealthy-sensitive': 'UNHEALTHYfsg',
        'unhealthy': 'UNHEALTHY',
        'very-unhealthy': 'VERYUNHEALTHY',
        'hazardous': 'hazardous',
        'unknown': 'moderate'  // fallback for unknown values
    };

    const imageName = categoryToImage[category] || 'moderate';
    const iconUrl = `../public/images/${imageName}.png`;  // Corrected path
    console.log('Loading icon:', iconUrl);

    return L.icon({
        iconUrl: iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

function initializeMap() {
    // Make sure Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }

    console.log('Initializing map...');  // Debug log

    try {
        // Create map centered on Uintah Basin
        map = L.map('map').setView([40.3207, -109.5287], 9);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Initial update of markers
        updateStationMarkers();

        // Update markers every 5 minutes
        setInterval(updateStationMarkers, 5 * 60 * 1000);

        console.log('Map initialized successfully');  // Debug log
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Create and update station markers
async function updateStationMarkers() {
    try {
        console.log('Updating station markers...');
        const conditions = await API.getCurrentConditions();

        if (!conditions) {
            console.error('No conditions data available');
            return;
        }

        // Update each station's marker
        Object.entries(API.STATIONS).forEach(([station, coords]) => {
            console.log(`Updating ${station}...`, coords);  // Debug log with coordinates

            const stationData = {
                ozone: conditions.Ozone?.[station],
                pm25: conditions['PM2.5']?.[station],
                temp: conditions.Temperature?.[station],
                nox: conditions.NOx?.[station]
            };

            // Determine air quality category based on ozone
            const category = API.getAirQualityCategory(stationData.ozone);
            const icon = createCustomIcon(category);

            // Create or update marker
            if (stationMarkers[station]) {
                stationMarkers[station].setPopupContent(
                    createPopupContent(station, stationData)
                );
                stationMarkers[station].setIcon(icon);
            } else {
                console.log(`Creating new marker for ${station} at`, coords);
                stationMarkers[station] = L.marker(
                    [coords.lat, coords.lng],
                    { icon: icon }
                )
                    .bindPopup(createPopupContent(station, stationData))
                    .addTo(map);
            }
        });

        updateLegend();
        console.log('Markers updated successfully');
    } catch (error) {
        console.error('Error updating markers:', error);
    }
}

// Create popup content for station
function createPopupContent(station, data) {
    // Use the correct image names from the prototype
    const stationToImage = {
        'Roosevelt': 'ROOSEVELT',
        'Vernal': 'vernalweb',
        'Horsepool': 'horsepool',
        'Redwash': 'redwash1',
        'Ouray': 'OURAY'
    };

    const imageName = stationToImage[station];
    const imageHtml = imageName ?
        `<img src="../public/images/${imageName}.png" alt="${station}" style="width:100%; max-width:200px; margin:10px 0;">` :
        '';

    return `
        <div class="station-popup">
            <h3>${station}</h3>
            ${imageHtml}
            <table>
                <tr>
                    <td>Ozone</td>
                    <td>${data.ozone?.toFixed(1) ?? 'N/A'} ppb</td>
                </tr>
                <tr>
                    <td>PM2.5</td>
                    <td>${data.pm25?.toFixed(1) ?? 'N/A'} µg/m³</td>
                </tr>
                <tr>
                    <td>Temperature</td>
                    <td>${data.temp?.toFixed(1) ?? 'N/A'} °C</td>
                </tr>
                <tr>
                    <td>NOx</td>
                    <td>${data.nox?.toFixed(1) ?? 'N/A'} ppb</td>
                </tr>
            </table>
        </div>
    `;
}

// Update the legend with images instead of colored dots
function updateLegend() {
    const legendContent = `
        <h4>Air Quality Index</h4>
        <div><img src="../public/images/GOOD.png" style="width:24px; vertical-align:middle;" alt="Good"> Good (0-50 ppb)</div>
        <div><img src="../public/images/moderate.png" style="width:24px; vertical-align:middle;" alt="Moderate"> Moderate (51-100 ppb)</div>
        <div><img src="../public/images/UNHEALTHYfsg.png" style="width:24px; vertical-align:middle;" alt="Unhealthy for Sensitive Groups"> Unhealthy for Sensitive Groups (101-150 ppb)</div>
        <div><img src="../public/images/UNHEALTHY.png" style="width:24px; vertical-align:middle;" alt="Unhealthy"> Unhealthy (151-200 ppb)</div>
        <div><img src="../public/images/VERYUNHEALTHY.png" style="width:24px; vertical-align:middle;" alt="Very Unhealthy"> Very Unhealthy (201-300 ppb)</div>
        <div><img src="../public/images/hazardous.png" style="width:24px; vertical-align:middle;" alt="Hazardous"> Hazardous (301+ ppb)</div>
    `;

    document.getElementById('map-legend').innerHTML = legendContent;
}