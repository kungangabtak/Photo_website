// Enhanced weather integration for UIUC Grad Photos website
// Using Open Meteo API - no API key required

document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const CHAMPAIGN_LAT = 40.1164; // Champaign-Urbana coordinates
    const CHAMPAIGN_LON = -88.2434;
    const UNITS = 'imperial'; // 'imperial' for Fahrenheit (used in UI display)
    
    // Weather icon mapping from WMO codes to Font Awesome icons
    // https://open-meteo.com/en/docs#weathervariables
    const weatherIcons = {
        0: 'fas fa-sun', // Clear sky
        1: 'fas fa-sun', // Mainly clear
        2: 'fas fa-cloud-sun', // Partly cloudy
        3: 'fas fa-cloud', // Overcast
        45: 'fas fa-smog', // Fog
        48: 'fas fa-smog', // Depositing rime fog
        51: 'fas fa-cloud-rain', // Light drizzle
        53: 'fas fa-cloud-rain', // Moderate drizzle
        55: 'fas fa-cloud-showers-heavy', // Dense drizzle
        56: 'fas fa-cloud-rain', // Light freezing drizzle
        57: 'fas fa-cloud-showers-heavy', // Dense freezing drizzle
        61: 'fas fa-cloud-rain', // Slight rain
        63: 'fas fa-cloud-rain', // Moderate rain
        65: 'fas fa-cloud-showers-heavy', // Heavy rain
        66: 'fas fa-cloud-rain', // Light freezing rain
        67: 'fas fa-cloud-showers-heavy', // Heavy freezing rain
        71: 'fas fa-snowflake', // Slight snow fall
        73: 'fas fa-snowflake', // Moderate snow fall
        75: 'fas fa-snowflake', // Heavy snow fall
        77: 'fas fa-snowflake', // Snow grains
        80: 'fas fa-cloud-rain', // Slight rain showers
        81: 'fas fa-cloud-showers-heavy', // Moderate rain showers
        82: 'fas fa-cloud-showers-heavy', // Violent rain showers
        85: 'fas fa-snowflake', // Slight snow showers
        86: 'fas fa-snowflake', // Heavy snow showers
        95: 'fas fa-bolt', // Thunderstorm
        96: 'fas fa-bolt', // Thunderstorm with slight hail
        99: 'fas fa-bolt' // Thunderstorm with heavy hail
    };
    
    // Get day/night suffix based on hour
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'd' : 'n';
    };
    
    // Elements
    const currentWeatherCard = document.getElementById('current-weather-card');
    const forecastContainer = document.getElementById('forecast-container');
    
    // Function to fetch current weather data
    const fetchCurrentWeather = async () => {
        try {
            // Construct Open Meteo API URL for current weather
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${CHAMPAIGN_LAT}&longitude=${CHAMPAIGN_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.current) {
                throw new Error('API Error: No current weather data available');
            }
            
            // Format the data to match our UI expectations
            const formattedData = {
                main: {
                    temp: data.current.temperature_2m,
                    humidity: data.current.relative_humidity_2m
                },
                weather: [
                    {
                        id: data.current.weather_code,
                        description: getWeatherDescription(data.current.weather_code),
                        icon: data.current.weather_code
                    }
                ],
                wind: {
                    speed: data.current.wind_speed_10m
                }
            };
            
            updateCurrentWeather(formattedData);
        } catch (error) {
            console.error('Error fetching current weather:', error);
            displayWeatherError(currentWeatherCard);
        }
    };
    
    // Function to fetch forecast data
    const fetchForecast = async () => {
        try {
            // Construct Open Meteo API URL for 7-day forecast
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${CHAMPAIGN_LAT}&longitude=${CHAMPAIGN_LON}&daily=temperature_2m_max,weather_code&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=7`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.daily) {
                throw new Error('API Error: No forecast data available');
            }
            
            // Format the data to match our UI expectations
            const formattedData = {
                list: []
            };
            
            // Process each day in the forecast
            for (let i = 0; i < data.daily.time.length; i++) {
                formattedData.list.push({
                    dt: new Date(data.daily.time[i]).getTime() / 1000,
                    main: { 
                        temp: data.daily.temperature_2m_max[i] 
                    },
                    weather: [{ 
                        description: getWeatherDescription(data.daily.weather_code[i]), 
                        icon: data.daily.weather_code[i]
                    }]
                });
            }
            
            updateForecast(formattedData);
            updateWeatherTips(formattedData);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            displayForecastError();
        }
    };
    
    // Helper function to get weather description from WMO code
    const getWeatherDescription = (code) => {
        const descriptions = {
            0: 'clear sky',
            1: 'mainly clear',
            2: 'partly cloudy',
            3: 'overcast',
            45: 'fog',
            48: 'depositing rime fog',
            51: 'light drizzle',
            53: 'moderate drizzle',
            55: 'dense drizzle',
            56: 'light freezing drizzle',
            57: 'dense freezing drizzle',
            61: 'slight rain',
            63: 'moderate rain',
            65: 'heavy rain',
            66: 'light freezing rain',
            67: 'heavy freezing rain',
            71: 'slight snow',
            73: 'moderate snow',
            75: 'heavy snow',
            77: 'snow grains',
            80: 'slight rain showers',
            81: 'moderate rain showers',
            82: 'violent rain showers',
            85: 'slight snow showers',
            86: 'heavy snow showers',
            95: 'thunderstorm',
            96: 'thunderstorm with slight hail',
            99: 'thunderstorm with heavy hail'
        };
        
        return descriptions[code] || 'unknown';
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
                <i class="${iconClass}" aria-hidden="true"></i>
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
        
        // Generate forecast HTML
        let forecastHTML = '';
        
        data.list.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = getDayName(date);
            const iconClass = weatherIcons[day.weather[0].icon] || 'fas fa-sun';
            const temp = Math.round(day.main.temp);
            const description = day.weather[0].description;
            
            forecastHTML += `
                <div class="forecast-day">
                    <p class="forecast-date">${dayName}</p>
                    <div class="forecast-icon">
                        <i class="${iconClass}" aria-hidden="true"></i>
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
                <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                <p>Unable to load weather data</p>
            </div>
        `;
    };
    
    // Helper function to display error for forecast
    const displayForecastError = () => {
        if (!forecastContainer) return;
        
        forecastContainer.innerHTML = `
            <div class="weather-error">
                <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
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
    
    // Add photo weather tips based on forecast
    const updateWeatherTips = (forecast) => {
        const tipsContainer = document.querySelector('.weather-tips ul');
        if (!tipsContainer) return;
        
        // Get the weather code for tomorrow
        const tomorrowWeather = forecast.list[1]?.weather[0]?.icon;
        
        // Default tips that are always shown
        let tips = [
            '<i class="fas fa-sun"></i> <strong>Sunny days:</strong> Great for vibrant photos, but avoid harsh midday sun',
            '<i class="fas fa-cloud"></i> <strong>Overcast days:</strong> Perfect for even lighting and no harsh shadows',
            '<i class="fas fa-cloud-sun"></i> <strong>Golden hour:</strong> The hour after sunrise or before sunset for magical lighting'
        ];
        
        // Add conditional tips based on upcoming weather
        if (tomorrowWeather >= 51 && tomorrowWeather <= 67 || tomorrowWeather >= 80 && tomorrowWeather <= 82) {
            // Rain forecast
            tips.push('<i class="fas fa-umbrella"></i> <strong>Rain alert:</strong> Consider rescheduling or using our indoor backup locations');
        } else if (tomorrowWeather >= 71 && tomorrowWeather <= 77 || tomorrowWeather >= 85 && tomorrowWeather <= 86) {
            // Snow forecast
            tips.push('<i class="fas fa-snowflake"></i> <strong>Snow expected:</strong> Dress warmly and consider bringing a change of shoes');
        } else if (tomorrowWeather >= 95 && tomorrowWeather <= 99) {
            // Thunderstorm forecast
            tips.push('<i class="fas fa-bolt"></i> <strong>Thunderstorm warning:</strong> We strongly recommend rescheduling for safety');
        } else if (tomorrowWeather === 0 || tomorrowWeather === 1) {
            // Clear sky forecast
            tips.push('<i class="fas fa-sun"></i> <strong>Clear skies tomorrow:</strong> Ideal for outdoor photography, consider morning or late afternoon for best lighting');
        }
        
        // Add the tips to the container
        tipsContainer.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    };
    
    // Initialize weather data if we're on the scheduling page
    if (currentWeatherCard && forecastContainer) {
        fetchCurrentWeather();
        fetchForecast();
    }
});