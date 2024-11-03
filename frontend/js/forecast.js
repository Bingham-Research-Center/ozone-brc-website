/* global Chart */  // Tell WebStorm about Chart.js

let forecastChart = null;  // Store chart instance globally

// Initialize the forecast display
async function initializeForecast() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }
    await updateLatestForecast();
    await updateForecastChart();
}

// Update the latest forecast text
async function updateLatestForecast() {
    try {
        const forecastText = await API.getLatestForecast();
        const forecastElement = document.getElementById('latest-forecast');

        // Convert plain text to HTML with paragraphs
        const formattedText = forecastText
            .split('\n\n')
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');

        forecastElement.innerHTML = formattedText;
    } catch (error) {
        console.error('Error updating forecast:', error);
        document.getElementById('latest-forecast').innerHTML =
            '<p>Unable to load forecast at this time.</p>';
    }
}

// Update the forecast chart using Chart.js
async function updateForecastChart() {
    try {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }

        const windData = await API.getWindData();
        if (!windData) {
            console.error('No wind data available');
            return;
        }

        const chartElement = document.getElementById('forecast-chart');
        if (!chartElement) {
            console.error('Forecast chart element not found');
            return;
        }

        // Process wind data for charting
        const data = Object.entries(windData).map(([timestamp, values]) => ({
            x: new Date(parseInt(timestamp)),
            y: values['Wind Speed']
        }));

        // Destroy existing chart if it exists
        if (forecastChart !== null) {
            forecastChart.destroy();
            forecastChart = null;
        }

        // Create new chart
        const ctx = chartElement.getContext('2d');
        forecastChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Wind Speed (m/s)',
                    data: data,
                    borderColor: '#2c3e50',
                    backgroundColor: 'rgba(44, 62, 80, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        adapters: {
                            date: {
                                // required to work with date-fns adapter
                            }
                        },
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'MMM d, HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Wind Speed (m/s)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Wind Speed Forecast'
                    }
                }
            }
        });

        console.log('Chart created successfully');
    } catch (error) {
        console.error('Error updating forecast chart:', error);
    }
}

// Initialize forecast components
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing forecast components...');
    initializeForecast();
    // Update forecast every 15 minutes
    setInterval(updateLatestForecast, 15 * 60 * 1000);
    setInterval(updateForecastChart, 15 * 60 * 1000);
});