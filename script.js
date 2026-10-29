const searchButton = document.querySelector(".searchButton-icon");
const cityInput = document.querySelector(".search-input");
const currentWeatherDiv = document.querySelector(".sec1-wrapper");
const weatherCardsDiv = document.querySelector(".forecast");

const API_KEY = "3b083e17996afb741c42ac6fde0e9bb9"; // API KEY for openweather API

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        let img = null;
        if (weatherItem.weather[0].main === "Rain") {
          img = "rainyB";
        }
        if (weatherItem.weather[0].main === "Clear") {
          img = "sunnyB";
        }
        if (weatherItem.weather[0].main === "Clouds") {
          if (weatherItem.weather[0].description === "few clouds") {
            img = "sunny-cloudyB";
          } else {
            img = "CloudB";
          }
        }
        return `<div class="sec1-wrapper">
          <div class="data">
            <div class="place">
              <p><i class="fa-solid fa-location-dot"></i>KATHMANDU, NEPAL</p>
              <h2>${cityName}</h2>
            </div>
            <div class="date-time">
              <p>${new Date(weatherItem.dt_txt).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            })}</p>
              <ul>
                <li>${weatherItem.dt_txt.split(" ")[1]} . Updated just now</li>
              </ul>
            </div>
          </div>
          <div class="sec1-main">
            <div class="sec1-left">
              <div class="left-data">
                <div class="normal">RIGHT NOW</div>
                <div class="normal">H: 21&deg; / L: 14&deg;</div>
                <div class="big">18&deg;C.</div>
                <div class="img">
                  <img src="./img/${img}.png">
                  <div class="space">
                    <h3>Mostly sunny</h3>
                    <p>A little coastal breeze. A lot to look forward to.</p>
                  </div> 
                </div>
              </div>
              <p class="under">Feels like 17&deg;</p>
              <div class="bottom-info">
                <div><img src="./img/wind.png" alt="wind-logo">  W 14 Km/h</div>
                <div><img src="./img/water.png" alt="water-logo">  68% humidity</div>
                <div><img src="./img/rain.png" alt="rain-logo">  5% rain</div>
              </div>
            </div>
            <div class="sec1-right">
              <div class="img">
                <div class="top">
                  <img src="./img/Vector.png" alt="stars-img" class="fix">
                  <p class="fix">THE DAY AHEAD</p>
                </div>
                <div class="btm">
                  <h3>A good day to get outside</h3>
                  <p>clear skies through the afternoon, with a cooler breeze arriving after 5 PM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }
    else
    {
        let img1 = null;
        if (weatherItem.weather[0].main === "Rain") {
          img1 = "rainy";
        }
        if (weatherItem.weather[0].main === "Clear") {
          img1 = "sunny";
        }
        if (weatherItem.weather[0].main === "Clouds") {
          if (weatherItem.weather[0].description === "few clouds") {
            img1 = "sunny-cloudy";
          } else {
            img1 = "Cloud";
          }
        }
        return `<div class="same">
                      <p>${new Date(weatherItem.dt_txt).toLocaleDateString(
                            "en-US",
                          {
                          weekday: "long",
                          },
                      )}</p>
                      <p>(${weatherItem.dt_txt.split(" ")[0]})</p>
                      <img src="./img/${img1}.png" alt="weather image">
                      <h2>${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    </div>`;
    }
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      //filter the forecast to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      //clearing previous weather data
      cityInput.value = "";
      weatherCardsDiv.innerHTML = "";
      currentWeatherDiv.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem, index) => {
        if(index === 0) {
             currentWeatherDiv.insertAdjacentHTML(
              "beforeend",
              createWeatherCard(cityName, weatherItem, index));
        }
        else {
            weatherCardsDiv.insertAdjacentHTML(
              "beforeend",
              createWeatherCard(cityName, weatherItem, index));
        } 
      });
    })
    .catch(() => {
      alert("An error occured while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim(); //gets the city name and removes additional spaces
  if (!cityName) {
    return;
  }
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  //Helps to get the coordinates (name, latitude, longitude) for the entered city from API response
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occured while fetching the coordinates !");
    });
};

searchButton.addEventListener("click", getCityCoordinates);
