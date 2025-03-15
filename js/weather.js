// Weather integration for UIUC Grad Photos website
// Uses OpenWeatherMap API to display current weather and forecast

document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
    const CHAMPAIGN_LAT = 40.1164; // Champaign-Urbana coordinates
    const CHAMPAIGN_LON = -88.2434;
    const UNITS = 'imperial'; // Use imperial units for the US (Fahrenheit)
    
    // Weather icon mapping from OpenWeatherMap codes to Font Awesome icons
    const weatherIcons = {
        '01d': 'fas fa-sun', // clear sky day
        '01n': 'fas fa-moon', // clear sky night
        '02d': 'fas fa-cloud-sun', // few clouds day
        '02n': 'fas fa-cloud-moon', // few clouds night
        '03d': 'fas fa-cloud', // scattered clouds
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud', // broken clouds
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-showers-heavy', // shower rain
        '09n': 'fas fa-cloud-showers-heavy',
        '10d': 'fas fa-cloud-rain', // rain day
        '10n': 'fas fa-cloud-rain', // rain night
        '11d': 'fas fa-bolt', // thunderstorm
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake', // snow
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog', // mist
        '50n': 'fas fa-smog'
    };
    
    // Elements
    const currentWeatherCard = document.getElementById('current-weather-card');
    const forecastContainer = document.getElementById('forecast-container');
    
    // Function to fetch current weather data
    const fetchCurrentWeather = async () => {
        try {
            // For development/demo purposes, use mock data
            // In production, uncomment the fetch code and use your actual API key
            
            // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${CHAMPAIGN_LAT}&lon=${CHAMPAIGN_LON}&units=${UNITS}&appid=${WEATHER_API_KEY}`);
            // const data = await response.json();
            
            // Mock data for development
            const data = {
                main: {
                    temp: 72.5,
                    feels_like: 71.8,
                    humidity: 65
                },
                weather: [
                    {
                        id: 800,
                        main: 'Clear',
                        description: 'clear sky',
                        icon: '01d'
                    }
                ],
                wind: {
                    speed: 5.82
                }
            };
            
            updateCurrentWeather(data);
        } catch (error) {
            console.error('Error fetching current weather:', error);
            displayWeatherError(currentWeatherCard);
        }
    };
    
    // Function to fetch forecast data
    const fetchForecast = async () => {
        try {
            // For development/demo purposes, use mock data
            // In production, uncomment the fetch code and use your actual API key
            
            // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${CHAMPAIGN_LAT}&lon=${CHAMPAIGN_LON}&units=${UNITS}&appid=${WEATHER_API_KEY}`);
            // const data = await response.json();
            
            // Mock data for development
            const data = {
                list: [
                    // Day 1
                    {
                        dt: new Date().setHours(0, 0, 0, 0) / 1000 + 86400,
                        main: { temp: 75.2 },
                        weather: [{ description: 'sunny', icon: '01d' }]
                    },
                    // Day 2
                    {
                        dt: new Date().setHours(0, 0, 0, 0) / 1000 + 172800,
                        main: { temp: 73.4 },
                        weather: [{ description: 'partly cloudy', icon: '02d' }]
                    },
                    // Day 3
                    {
                        dt: new Date().setHours(0, 0, 0, 0) / 1000 + 259200,
                        main: { temp: 68.9 },
                        weather: [{ description: 'light rain', icon: '10d' }]
                    },
                    // Day 4
                    {
                        dt: new Date().setHours(0, 0, 0, 0) / 1000 + 345600,
                        main: { temp: 71.6 },
                        weather: [{ description: 'cloudy', icon: '03d' }]
                    },
                    // Day 5
                    {
                        dt: new Date().setHours(0, 0, 0, 0) / 1000 + 432000,
                        main: { temp: 77.0 },
                        weather: [{ description: 'clear', icon: '01d' }]
                    },
                    // Day 6
                    {
                        dt: new Date().setHours(0, 0, 0, 0) / 1000 + 518400,
                        main: { temp: 79.2 },
                        weather: [{ description: 'sunny', icon: '01d' }]
                    },
                    // Day 7
                    {
                        dt: new Date().setHours(0, 0, 0, 0) / 1000 + 604800,
                        main: { temp: 74.5 },
                        weather: [{ description: 'partly cloudy', icon: '02d' }]
                    }
                ]
            };
            
            updateForecast(data);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            displayForecastError();
        }
    };
    
    // Function to update current weather display
    const updateCurrentWeather = (data) => {
        if (!currentWeatherCard) return;
        
        const icon = data.weather[0].icon;
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        
        const iconClass = weatherIcons[icon] || 'fas fa-sun';
        
        currentWeatherCard.innerHTML = `
            <div class="weather-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="weather-details">
                <p class="temperature">${temp}°F</p>
                <p class="conditions">${capitalizeFirstLetter(description)}</p>
                <p class="humidity">Humidity: ${humidity}% | Wind: ${windSpeed} mph</p>
            </div>
        `;
    };
    
    // Function to update forecast display
    const updateForecast = (data) => {
        if (!forecastContainer) return;
        
        // Process forecast data - get one entry per day
        const dailyForecasts = getDailyForecasts(data.list);
        
        // Generate forecast HTML
        let forecastHTML = '';
        
        dailyForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = getDayName(date);
            const iconClass = weatherIcons[day.weather[0].icon] || 'fas fa-sun';
            const temp = Math.round(day.main.temp);
            const description = day.weather[0].description;
            
            forecastHTML += `
                <div class="forecast-day">
                    <p class="forecast-date">${dayName}</p>
                    <div class="forecast-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <p class="forecast-temp">${temp}°F</p>
                    <p class="forecast-conditions">${capitalizeFirstLetter(description)}</p>
                </div>
            `;
        });
        
        forecastContainer.innerHTML = forecastHTML;
    };
    
    // Helper function to display error for current weather
    const displayWeatherError = (element) => {
        element.innerHTML = `
            <div class="weather-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load weather data</p>
            </div>
        `;
    };
    
    // Helper function to display error for forecast
    const displayForecastError = () => {
        if (!forecastContainer) return;
        
        forecastContainer.innerHTML = `
            <div class="weather-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load forecast data</p>
            </div>
        `;
    };
    
    // Helper function to capitalize first letter
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    // Helper function to get day name
    const getDayName = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };
    
    // Helper function to get one forecast entry per day
    const getDailyForecasts = (forecastList) => {
        // This simplified version just returns the list directly since our mock data
        // is already set up with one entry per day
        // In production with actual API data, you'd need to filter the list to get one entry per day
        return forecastList;
    };
    
    // Add photo weather tips based on forecast
    const updateWeatherTips = (data) => {
        // This would add dynamic tips based on the forecast
        // Not implemented in this demo version
    };
    
    // Initialize weather data if we're on the scheduling page
    if (currentWeatherCard && forecastContainer) {
        fetchCurrentWeather();
        fetchForecast();
    }
});