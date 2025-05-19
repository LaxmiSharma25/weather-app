const apiKey = 'your api-key'; // changed to my own api-key from openweathermap

const cityInput   = document.getElementById('city-input');
const searchBtn   = document.getElementById('search-btn');
const weatherIcon = document.querySelector('.weather-icon i');
const tempEl      = document.getElementById('temp');
const descEl      = document.getElementById('description');
const cityEl      = document.getElementById('city');
const humidityEl  = document.getElementById('humidity');
const windEl      = document.getElementById('wind');

// Map OpenWeather “main” condition to FontAwesome icon classes
function updateWeatherIcon(condition) {
  const icons = {
    Clear:        'fa-sun',
    Clouds:       'fa-cloud',
    Rain:         'fa-cloud-rain',
    Drizzle:      'fa-cloud-rain',
    Thunderstorm: 'fa-bolt',
    Snow:         'fa-snowflake',
    Mist:         'fa-smog'
  };
  const cls = icons[condition] || 'fa-cloud';
  weatherIcon.className = `fas ${cls}`;
}

// Fetch data from OpenWeather
async function getWeatherData(cityName) {
  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }

    const url = 
      `https://api.openweathermap.org/data/2.5/weather`
      + `?q=${encodeURIComponent(cityName)}`
      + `&appid=${apiKey}`
      + `&units=metric`;

    console.log('Requesting:', url);
    const res  = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch weather');
    }

    return data;
  } catch (err) {
    alert(`Error: ${err.message}`);
    console.error(err);
    return null;
  }
}

// Populate the UI
function updateUI(data) {
  if (!data) return;

  tempEl.textContent     = Math.round(data.main.temp);
  descEl.textContent     = data.weather[0].description;
  cityEl.textContent     = data.name;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent     = Math.round(data.wind.speed * 3.6); // m/s → km/h

  updateWeatherIcon(data.weather[0].main);
}

// Handler for search action
async function handleSearch() {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const weatherData = await getWeatherData(cityName);
  updateUI(weatherData);
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleSearch();
});