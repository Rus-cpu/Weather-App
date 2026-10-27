const searchButton = document.querySelector(".searchButton-icon");
const cityInput = document.querySelector(".search-input");
const API_KEY = "";

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();//gets the city name and removes additional spaces
    if(!cityName) {
        return;
    }
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
}

document.addEventListener("click", getCityCoordinates);
