const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");

// Run getWeather when the Search button is clicked
searchButton.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();

    // Make sure the user entered a city
    if (city === "") {
        alert("Please enter a city");
        return;
    }

    try {
        // Step 1: Convert the city name into latitude and longitude
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        const geoData = await geoResponse.json();

        // Check if the city was found
        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found. Please try again.");
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get the current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Convert weather code into a description
        let weatherDescription = "";

        if (current.weather_code === 0) {
            weatherDescription = "Clear";
        } else if (
            current.weather_code === 1 ||
            current.weather_code === 2 ||
            current.weather_code === 3
        ) {
            weatherDescription = "Cloudy";
        } else if (
            current.weather_code >= 51 &&
            current.weather_code <= 67
        ) {
            weatherDescription = "Rain";
        } else if (
            current.weather_code >= 71 &&
            current.weather_code <= 77
        ) {
            weatherDescription = "Snow";
        } else if (
            current.weather_code >= 80 &&
            current.weather_code <= 82
        ) {
            weatherDescription = "Rain Showers";
        } else if (current.weather_code >= 95) {
            weatherDescription = "Thunderstorm";
        } else {
            weatherDescription = "Unknown";
        }

        // Step 4: Display the weather on the page
        document.getElementById("city-name").textContent =
            location.name;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;

        document.getElementById("description").textContent =
            weatherDescription;

        document.getElementById("humidity").textContent =
            `Humidity: ${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `Wind: ${current.wind_speed_10m} km/h`;

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
}