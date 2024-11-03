/* global Chart */  // Tell WebStorm about Chart

// Data handling utilities
const API = {
    // Station locations with actual coordinates from the region
    STATIONS: {
        'Roosevelt': { lat: 40.2994, lng: -110.0090,
            image: '../public/images/ROOSEVELT.png' },
        'Vernal': { lat: 40.4527, lng: -109.5927,
            image: '../public/images/VERNAL.png' },
        'Horsepool': { lat: 40.1434, lng: -109.4680,
            image: '../public/images/HORSEPOOL.png' },
        'Redwash': { lat: 40.2069, lng: -109.3534,
            image: '../public/images/REDWASH.png' },
        'Ouray': { lat: 40.1367, lng: -109.6627,
            image: '../public/images/OURAY.png' }
    },

    // Fetch current observations
    async getCurrentConditions() {
        try {
            // First try the API
            const response = await fetch('/api/obs');
            if (response.ok) {
                return await response.json();
            }

            // If API fails, use mock data
            console.log('Using mock data for development');
            return {
                "PM2.5": {
                    "Roosevelt": 5.0,
                    "Vernal": 2.5,
                    "Horsepool": null,
                    "Redwash": 3.0,
                    "Ouray": 4.0
                },
                "Ozone": {
                    "Roosevelt": 46.0,
                    "Vernal": 42.0,
                    "Horsepool": 45.0,
                    "Redwash": 43.0,
                    "Ouray": 44.0
                },
                "Temperature": {
                    "Roosevelt": 16.5,
                    "Vernal": 17.0,
                    "Horsepool": 18.0,
                    "Redwash": 17.5,
                    "Ouray": 16.0
                },
                "NOx": {
                    "Roosevelt": null,
                    "Vernal": 4.3,
                    "Horsepool": 4.0,
                    "Redwash": 3.8,
                    "Ouray": 4.1
                }
            };
        } catch (error) {
            console.error('Error fetching current conditions:', error);
            return null;
        }
    },

    // Fetch wind data
    async getWindData() {
        try {
            const response = await fetch('/api/wind');
            if (response.ok) {
                return await response.json();
            }

            // Mock data for development
            console.log('Using mock wind data');
            const mockData = {};
            const startTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
            for (let i = 0; i < 24; i++) {
                mockData[startTime + (i * 60 * 60 * 1000)] = {
                    'Wind Speed': Math.random() * 5 + 1
                };
            }
            return mockData;
        } catch (error) {
            console.error('Error fetching wind data:', error);
            return null;
        }
    },

    // Fetch latest forecast text
    async getLatestForecast() {
        try {
            const response = await fetch('../public/TEXTFILES/forecast.txt');
            if (response.ok) {
                return await response.text();
            }
            return 'Sample forecast text for development. Real forecast data will be loaded here.';
        } catch (error) {
            console.error('Error fetching forecast:', error);
            return 'Unable to load forecast at this time.';
        }
    },

    // Get air quality category based on ozone value
    getAirQualityCategory(ozoneValue) {
        if (!ozoneValue) return 'unknown';
        if (ozoneValue <= 50) return 'good';
        if (ozoneValue <= 100) return 'moderate';
        if (ozoneValue <= 150) return 'unhealthy-sensitive';
        if (ozoneValue <= 200) return 'unhealthy';
        if (ozoneValue <= 300) return 'very-unhealthy';
        return 'hazardous';
    },

    // Get color for air quality category
    getCategoryColor(category) {
        const colors = {
            'good': '#00e400',
            'moderate': '#ffff00',
            'unhealthy-sensitive': '#ff7e00',
            'unhealthy': '#ff0000',
            'very-unhealthy': '#99004c',
            'hazardous': '#7e0023',
            'unknown': '#999999'
        };
        return colors[category] || colors.unknown;
    }
};