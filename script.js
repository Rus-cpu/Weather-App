const searchButton = document.querySelector(".searchButton-icon");
const cityInput = document.querySelector(".search-input");
const weatherCardsDiv = document.querySelector(".forecast");

const API_KEY = "3b083e17996afb741c42ac6fde0e9bb9";// API KEY for openweather API

const createWeatherCard = (weatherItem) => {
    let img = null;
    if(weatherItem.weather[0].main === "Rain") {
        img = rainy;
    }
    if(weatherItem.weather[0].main === "Clear") {
        img = sunny;
    }
    if(weatherItem.weather[0].main === "Clouds") {
        if(weatherItem.weather[0].description === "few clouds") {
            img = sunny-cloudy;
        }
        else {
            img = Cloud;
        }
    }
    return `<div class="same">
                <p>${weatherItem.dt_txt.split("")[0]}</p>
                <p>(${weatherItem.dt_txt.split("")[0]})</p>
                <img src="./img/${img}.png" alt="weather image">
                <h2>${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C</h2>
              </div>`;
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        //filter the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const sixDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        //clearing previous weather data
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        console.log(sixDaysForecast);
        sixDaysForecast.forEach(weatherItem => {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
        });
    })
     .catch(() => {
        alert("An error occured while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();//gets the city name and removes additional spaces
    if(!cityName) {
        return;
    }
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    //Helps to get the coordinates (name, latitude, longitude) for the entered city from API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates !");
    });
}

searchButton.addEventListener("click", getCityCoordinates);

