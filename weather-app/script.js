class WeatherApp {
    constructor() {
        this.elements = {
            searchInput: document.getElementById('search-input'),
            searchBtn: document.getElementById('search-btn'),
            unitToggle: document.getElementById('unit-toggle'),
            loading: document.getElementById('loading'),
            weatherDisplay: document.getElementById('weather-display'),
            notification: document.getElementById('notification'),
            currentTime: document.getElementById('current-time'),
            currentDate: document.getElementById('current-date'),
            cityCountry: document.getElementById('city-country'),
            currentTemp: document.getElementById('current-temp'),
            weatherIcon: document.getElementById('weather-icon'),
            weatherDesc: document.getElementById('weather-desc'),
            feelsLike: document.getElementById('feels-like'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('wind-speed'),
            precipitation: document.getElementById('precipitation'),
            dailyForecast: document.getElementById('daily-forecast'),
            hourlyForecast: document.getElementById('hourly-forecast'),
            daySelector: document.getElementById('day-selector'),
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset'),
            visibility: document.getElementById('visibility'),
            pressure: document.getElementById('pressure'),
            uvIndex: document.getElementById('uv-index'),
            windGust: document.getElementById('wind-gust'),
            errorMessage: document.getElementById('error-message')
        };

        this.state = {
            isCelsius: true,
            currentWeather: null,
            city: 'London',
            weatherData: null,
            dailyForecast: [],
            hourlyForecast: []
        };

        this.weatherIcons = {
            'clear': 'fas fa-sun',
            'partly-cloudy': 'fas fa-cloud-sun',
            'overcast': 'fas fa-cloud',
            'fog': 'fas fa-smog',
            'drizzle': 'fas fa-cloud-rain',
            'rain': 'fas fa-cloud-showers-heavy',
            'snow': 'fas fa-snowflake',
            'storm': 'fas fa-bolt'
        };

        this.init();
    }

    init() {
        this.updateCurrentTime();
        this.setupEventListeners();
        this.loadDefaultCity();
        
        // Update time every minute
        setInterval(() => this.updateCurrentTime(), 60000);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.elements.currentTime.querySelector('span').textContent = timeString;
        this.elements.currentDate.textContent = dateString;
    }

    setupEventListeners() {
        // Search button click
        this.elements.searchBtn.addEventListener('click', () => this.searchCity());
        
        // Enter key in search input
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        
        // Unit toggle
        this.elements.unitToggle.addEventListener('click', () => this.toggleUnits());
        
        // Day selector for hourly forecast
        this.elements.daySelector.addEventListener('change', (e) => {
            if (this.state.weatherData) {
                this.displayHourlyForecast(parseInt(e.target.value));
            }
        });
        
        // Close notification
        document.querySelector('.close-notification').addEventListener('click', () => {
            this.elements.notification.style.display = 'none';
        });
    }

    async searchCity() {
        const city = this.elements.searchInput.value.trim();
        if (!city) return;
        
        this.state.city = city;
        await this.fetchWeatherData(city);
        this.elements.searchInput.value = '';
    }

    async loadDefaultCity() {
        await this.fetchWeatherData(this.state.city);
    }

    async fetchWeatherData(city) {
        try {
            this.showLoading(true);
            
            // Get coordinates from OpenStreetMap
            const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            
            if (!geoData || geoData.length === 0) {
                throw new Error('City not found');
            }
            
            const lat = geoData[0].lat;
            const lon = geoData[0].lon;
            
            // Get weather data from Open-Meteo
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m,wind_gusts_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&hourly=temperature_2m,weather_code&timezone=auto`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            
            this.state.weatherData = weatherData;
            this.state.dailyForecast = this.processDailyForecast(weatherData.daily);
            this.state.hourlyForecast = this.processHourlyForecast(weatherData.hourly);
            
            this.displayWeather(weatherData, geoData[0]);
            this.showLoading(false);
            
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError(error.message);
            this.showLoading(false);
        }
    }

    processDailyForecast(dailyData) {
        const forecasts = [];
        for (let i = 0; i < Math.min(7, dailyData.time.length); i++) {
            forecasts.push({
                date: new Date(dailyData.time[i]),
                weatherCode: dailyData.weather_code[i],
                maxTemp: dailyData.temperature_2m_max[i],
                minTemp: dailyData.temperature_2m_min[i],
                sunrise: dailyData.sunrise[i],
                sunset: dailyData.sunset[i],
                uvIndex: dailyData.uv_index_max[i]
            });
        }
        return forecasts;
    }

    processHourlyForecast(hourlyData) {
        const hourly = [];
        for (let i = 0; i < Math.min(24 * 7, hourlyData.time.length); i++) {
            hourly.push({
                time: new Date(hourlyData.time[i]),
                temp: hourlyData.temperature_2m[i],
                weatherCode: hourlyData.weather_code[i]
            });
        }
        return hourly;
    }

    getWeatherIcon(code) {
        // Simplified mapping based on Open-Meteo weather codes
        if (code === 0) return 'fas fa-sun'; // Clear sky
        if (code <= 3) return 'fas fa-cloud-sun'; // Partly cloudy
        if (code <= 48) return 'fas fa-smog'; // Fog
        if (code <= 67) return 'fas fa-cloud-rain'; // Rain
        if (code <= 86) return 'fas fa-snowflake'; // Snow
        return 'fas fa-cloud'; // Default
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail'
        };
        return descriptions[code] || 'Unknown';
    }

    displayWeather(weatherData, geoData) {
        const current = weatherData.current;
        
        // Update location
        this.elements.cityCountry.textContent = `${geoData.display_name.split(',')[0]}, ${geoData.display_name.split(',').pop().trim()}`;
        
        // Update current weather
        const temp = Math.round(current.temperature_2m);
        this.elements.currentTemp.textContent = this.state.isCelsius ? temp : this.celsiusToFahrenheit(temp);
        
        const weatherCode = current.weather_code;
        this.elements.weatherIcon.className = this.getWeatherIcon(weatherCode);
        this.elements.weatherDesc.textContent = this.getWeatherDescription(weatherCode);
        
        // Update weather details
        const feelsLike = Math.round(current.apparent_temperature);
        this.elements.feelsLike.textContent = this.state.isCelsius ? 
            `${feelsLike}°` : `${this.celsiusToFahrenheit(feelsLike)}°`;
        
        this.elements.humidity.textContent = `${current.relative_humidity_2m}%`;
        
        const windSpeed = current.wind_speed_10m;
        this.elements.windSpeed.textContent = this.state.isCelsius ? 
            `${windSpeed.toFixed(1)} km/h` : `${(windSpeed * 0.621371).toFixed(1)} mph`;
        
        this.elements.precipitation.textContent = `${current.precipitation.toFixed(1)} mm`;
        
        // Update additional info
        if (weatherData.daily) {
            const sunrise = new Date(weatherData.daily.sunrise[0]);
            const sunset = new Date(weatherData.daily.sunset[0]);
            this.elements.sunrise.textContent = sunrise.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            this.elements.sunset.textContent = sunset.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            this.elements.uvIndex.textContent = weatherData.daily.uv_index_max[0].toFixed(1);
        }
        
        this.elements.visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
        this.elements.pressure.textContent = `${Math.round(current.pressure_msl)} hPa`;
        this.elements.windGust.textContent = this.state.isCelsius ? 
            `${current.wind_gusts_10m.toFixed(1)} km/h` : `${(current.wind_gusts_10m * 0.621371).toFixed(1)} mph`;
        
        // Display forecasts
        this.displayDailyForecast();
        this.displayHourlyForecast(0);
    }

    displayDailyForecast() {
        const forecastContainer = this.elements.dailyForecast;
        forecastContainer.innerHTML = '';
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        this.state.dailyForecast.forEach((day, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            
            const dayName = index === 0 ? 'Today' : days[day.date.getDay()];
            const maxTemp = this.state.isCelsius ? 
                Math.round(day.maxTemp) : this.celsiusToFahrenheit(Math.round(day.maxTemp));
            const minTemp = this.state.isCelsius ? 
                Math.round(day.minTemp) : this.celsiusToFahrenheit(Math.round(day.minTemp));
            
            dayElement.innerHTML = `
                <div class="day-name">${dayName}</div>
                <i class="${this.getWeatherIcon(day.weatherCode)} day-icon"></i>
                <div class="day-temp">
                    <span class="high-temp">${maxTemp}°</span>
                    <span class="low-temp">${minTemp}°</span>
                </div>
            `;
            
            forecastContainer.appendChild(dayElement);
        });
    }

    displayHourlyForecast(dayIndex) {
        const hourlyContainer = this.elements.hourlyForecast;
        hourlyContainer.innerHTML = '';
        
        const startHour = dayIndex * 24;
        const endHour = startHour + 12; // Show 12 hours
        
        for (let i = startHour; i < endHour && i < this.state.hourlyForecast.length; i++) {
            const hour = this.state.hourlyForecast[i];
            const hourElement = document.createElement('div');
            hourElement.className = 'hour-item';
            
            const timeString = hour.time.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                hour12: true 
            });
            const temp = this.state.isCelsius ? 
                Math.round(hour.temp) : this.celsiusToFahrenheit(Math.round(hour.temp));
            
            hourElement.innerHTML = `
                <div class="hour-time">${timeString}</div>
                <i class="${this.getWeatherIcon(hour.weatherCode)} hour-icon"></i>
                <div class="hour-temp">${temp}°</div>
            `;
            
            hourlyContainer.appendChild(hourElement);
        }
    }

    toggleUnits() {
        this.state.isCelsius = !this.state.isCelsius;
        
        // Update button text
        const unitText = this.elements.unitToggle.querySelector('#unit-text');
        unitText.textContent = this.state.isCelsius ? 'Switch to °F' : 'Switch to °C';
        
        // Update temperature unit indicator
        const unitElements = document.querySelectorAll('.temp-unit');
        unitElements.forEach(el => {
            el.textContent = this.state.isCelsius ? '°C' : '°F';
        });
        
        // Refresh display with new units
        if (this.state.weatherData) {
            this.displayWeather(this.state.weatherData, {
                display_name: this.elements.cityCountry.textContent
            });
        }
    }

    celsiusToFahrenheit(celsius) {
        return Math.round((celsius * 9/5) + 32);
    }

    showLoading(show) {
        if (show) {
            this.elements.loading.classList.add('active');
            this.elements.weatherDisplay.style.opacity = '0.5';
        } else {
            this.elements.loading.classList.remove('active');
            this.elements.weatherDisplay.style.opacity = '1';
        }
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.notification.style.display = 'flex';
        
        setTimeout(() => {
            this.elements.notification.style.display = 'none';
        }, 5000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const weatherApp = new WeatherApp();
    window.weatherApp = weatherApp; // Make it accessible from console if needed
});