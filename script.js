const searchButton = document.querySelector(".searchButton-icon");
const cityInput = document.querySelector(".search-input");
const currentWeatherDiv = document.querySelector(".sec1-wrapper");
const currentWeatherDetails = document.querySelector(".sec3");
const weatherCardsDiv = document.querySelector(".forecast");

const API_KEY = "3b083e17996afb741c42ac6fde0e9bb9"; // API KEY for openweather API


const getSunAndUVDetails = async (lat, lon) => {

    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index&daily=uv_index_max,sunrise,sunset&timezone=auto`;

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.reason || "Unable to fetch UV details");
        }

        // Current UV index
        const uvIndex = data.current.uv_index;

        // Today's sunrise and sunset
        const sunrise = data.daily.sunrise[0];
        const sunset = data.daily.sunset[0];

        console.log("UV Index:", uvIndex);
        console.log("Sunrise:", sunrise);
        console.log("Sunset:", sunset);

        return {
            uvIndex,
            sunrise,
            sunset,
            maxUV: data.daily.uv_index_max[0]
        };

    } catch (error) {
        console.error("UV and Sun API error:", error);
        return null;
    }
};

const createWeatherCard = async (cityName, weatherItem, index) => {
    let location = {};
    const countryNames = new Intl.DisplayNames(["en"], {
    type: "region"
    });// this displays the full name of the country
    const getUVCategory = (uvIndex) => {

    if (uvIndex <= 2) {
        return "Low";
    } 
    
    if (uvIndex <= 5) {
        return "Moderate";
    } 
    
    if (uvIndex <= 7) {
        return "High";
    } 
    
    if (uvIndex <= 10) {
        return "Very High";
    }
    return "Extreme";
  };

  console.log(getUVCategory(4)); 
    if (index === 0) {
    const PLACE_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

      try {
        const res = await fetch(PLACE_API_URL);
        const data = await res.json();

        if(data.length > 0) {
          location = data[0];
        }
      } catch(error) {
        console.log("API call failed:", error);
      }
          let img = null;
          let weather = null;
          let weatherDescription = null;
          let weatherDescriptionRU = null;
          let weatherDescriptionRD = null;
          if (weatherItem.weather[0].main === "Rain") {
            img = "rainyB";
            weather = "Rainy";
            weatherDescription = "A little rain. A perfect excuse to slow down."; 
            weatherDescriptionRU = "There's beauty in slowing down.";
            weatherDescriptionRD = "A rainy day is like a lovely gift -- you can sleep late and not feel guilty.";
          }
          if (weatherItem.weather[0].main === "Clear") {
            img = "sunnyB";
            weather = "Sunny";
            weatherDescription = "A whole lot of sunshine.";
            weatherDescriptionRU = "Golden skies. Brighter days ahead.";
            weatherDescriptionRD = "A lot of sun so a little bit of SPF and umberlla could come in handy";
          }
          if (weatherItem.weather[0].main === "Clouds") {
            if (weatherItem.weather[0].description === "few clouds") {
              img = "sunny-cloudyB";
              weather = "Mostly sunny";
              weatherDescription = "A little coastal breeze. A lot to look forward to.";
              weatherDescriptionRU = "A good day to get outside";
              weatherDescriptionRD = "clear skies through the afternoon, with a cooler breeze arriving after 5 PM.";
            } else {
              img = "CloudB";
              weather = "Cloudy";
              weatherDescription = "A little cloud cover. A moment to breathe.";
              weatherDescriptionRU = "A quieter sky. A calmer kind of mood.";
              weatherDescriptionRD = "The sky and the sun are always there. Its the clouds that come and go.";
            }
          }
          return `
          <div class="sec1">
          <div class="sec1-wrapper">
            <div class="data">
              <div class="place">
                <p><i class="fa-solid fa-location-dot"></i>${location.state}, ${countryNames.of(location.country)}</p>
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
                  <div class="normal">H: ${(weatherItem.main.temp_max - 273.15).toFixed(2)}&deg; / L: ${(weatherItem.main.temp_min - 273.15).toFixed(2)}&deg;</div>
                  <div class="big">${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C.</div>
                  <div class="img">
                    <img src="./img/${img}.png">
                    <div class="space">
                      <h3>${weather}</h3>
                      <p>${weatherDescription}</p>
                    </div> 
                  </div>
                </div>
                <p class="under">Feels like ${(weatherItem.main.feels_like - 273.15).toFixed(2)}&deg;</p>
                <div class="bottom-info">
                  <div><img src="./img/wind.png" alt="wind-logo">  W ${weatherItem.wind.speed} Km/h</div>
                  <div><img src="./img/water.png" alt="water-logo">  ${weatherItem.main.humidity}% humidity</div>
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
                    <h3>${weatherDescriptionRU}</h3>
                    <p>${weatherDescriptionRD}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          `;   
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

const createWeatherHighlights = (weatherItem) => {
  return ` <div class="sec3">
        <h1>Today's highlights</h1>
        <div class="sec3-wrapper">
          <div class="top-left s3">
            <div class="s3-1">
              <img src="./img/s-wind.png" alt="wind-img">
              <p>Wind</p>
            </div>
            <div class="s3-2">
              <h2>${weatherItem.wind.speed}</h2>
              <p>km/h</p>
            </div>
            <div class="tl">
              <img src="./img/arrow-up-right.png" alt="arrow">
              <p>Breeze</p>
            </div>
            <p>${weatherItem.wind.deg}&deg; . Gists up to ${weatherItem.wind.gust} km/h</p>
          </div>
          <div class="top-right s3">
            <div class="s3-1">
              <img src="./img/s-droplets.png" alt="droplet-img">
             <p>Humidity</p>
            </div>
            <div class="s3-2">
              <h2>${weatherItem.main.humidity}</h2>
              <p>&percnt;</p>
            </div>
            <img src="./img/Humidity gauge.png" alt="humidity gauge" id="tr">
            <p>Comfortable . Dew point 12&deg;C</p>
          </div>
          <div class="bottom-left s3">
            <div class="s3-1">
              <img src="./img/s-sun.png" alt="sun-img">
             <p>UV index</p>
            </div>
            <div class="s3-2">
              <h2>${uvIndex}</h2>
              <p>${getUVCategory(uvIndex)}</p>
            </div>
            <img src="./img/UV scale.png" alt="uv scale" class="bl">
            <p class="bl">A little SPF goes a long way today.</p>
          </div>
          <div class="bottom-right s3">
            <div class="s3-1">
              <img src="./img/s-sunrise.png" alt="sunrise-img">
             <p>Sunrise & sunset</p>
            </div>
            <img src="./img/Sun path.png" alt="sunrise">
            <div class="br">
              <div>
                <p>7:20 AM</p>
                <p>Sunrise</p>
              </div>
              <div>
                <p>6:29 PM</p>
                <p>Sunset</p>
              </div>
            </div>
            <p>11 hours, 9 minutes of daylight</p>
          </div>
        </div>
       </div>`;
};

const getWeatherDetails = async (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  try {
    const res = await fetch(WEATHER_API_URL);
    const data = await res.json();
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
  currentWeatherDetails.innerHTML = "";

  console.log(fiveDaysForecast);
  for (const [index, weatherItem] of fiveDaysForecast.entries()) {
    if(index === 0) {
         currentWeatherDiv.insertAdjacentHTML(
          "beforeend",
          await createWeatherCard(cityName, weatherItem, index));
    }
    else {
        weatherCardsDiv.insertAdjacentHTML(
          "beforeend",
          await createWeatherCard(cityName, weatherItem, index));
    } 
  }
  
    currentWeatherDetails.insertAdjacentHTML("beforeend", 
    createWeatherHighlights(fiveDaysForecast[0]));

} catch(error) {
      alert("An error occured while fetching the weather forecast!");
    };
};

const getCityCoordinates = async () => {
  const cityName = cityInput.value.trim(); //gets the city name and removes additional spaces
  if (!cityName) {
    return;
  }
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  try {
    const res = await fetch(GEOCODING_API_URL);
    const data = await res.json();
    //Helps to get the coordinates (name, latitude, longitude) for the entered city from API response
     if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { name, lat, lon } = data[0];
      await getWeatherDetails(name, lat, lon);
  } catch (error) {
    alert("An error occured while fetching the coordinates !");
  }
};

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
