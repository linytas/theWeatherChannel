// Get all necessary elements from the DOM
const timeE = document.getElementById("time");
const currentweatherItemsE = document.getElementById("current-weather-items");
const timezoneE = document.getElementById("timezone");
const countryE = document.getElementById("country");
const currentTempE = document.getElementById("current-temp");
const currentTempforecastE = document.getElementById("current-temp-forecast");
const weatherForecastE = document.getElementById("weather-forecast");

// Set days of a week
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// API KEY
const API_KEY = "8c7d08b07859b100fccebb7948dcb3cc";

// Get the date and time
setInterval(() => {
  const time = new Date();
  const hour = time.getHours();
  const minutes = time.getMinutes();

  const ampm = hour >= 12 ? "PM" : "AM";

  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;

  const hh =
    hoursIn12HrFormat < 10 ? `0${hoursIn12HrFormat}` : hoursIn12HrFormat;
  const mm = minutes < 10 ? `0${minutes}` : minutes;

  timeE.innerHTML = hh + ":" + mm + " " + `<span id="am-pm">${ampm}</span>`;
}, 1000);

// Initialize
getWeatherData();

// Function that fetches and displays the data from the waether API
function getWeatherData() {
  // Get current position (send request)
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}

// Add the weather details to the page
function showWeatherData(data) {
  let { humidity, pressure, clouds, wind_speed, temp } = data.current;
  const humid = document.getElementById("humidity");
  const Airpressure = document.getElementById("pressure");
  const rain = document.getElementById("rain");
  const wind = document.getElementById("wind");
  const Currenttemp = document.getElementById("current-temp");
  const timeZone = document.getElementById("time-zone");

  timeZone.innerHTML = `${data.timezone}`;

  humid.innerHTML = `${humidity} %`;
  Airpressure.innerHTML = `${pressure} hPa`;
  rain.innerHTML = `${clouds} %`;
  wind.innerHTML = `${Math.round(wind_speed)} mph`;
  Currenttemp.innerHTML = `${Math.round(temp * (9 / 5) + 32)} &#176;F`;

  let otherDayForecast = "";
  data.daily.forEach((day, idx) => {
    const unixTimestamp = day.dt;
    const dateobject = new Date(unixTimestamp * 1000);

    if (idx == 0) {
      currentTempforecastE.innerHTML = `<div>
                <div class="day">Today</div>
                    <div class="description">${day.weather[0].description}</div>
                </div>
                    <div class="temp">
                    <div>Max: ${Math.round(
                      day.temp.max * (9 / 5) + 32
                    )} &#176;F</div>
                    <div>Min: ${Math.round(
                      day.temp.min * (9 / 5) + 32
                    )} &#176;F</div>
                    </div>

                </div>`;
    } else {
      otherDayForecast += `<div class="weather-forecast-item">
            <div class="day">${dateobject.toLocaleString("en-US", {
              weekday: "long",
            })}</div>
            <div class="temp">${Math.round(
              day.temp.max * (9 / 5) + 32
            )} &#176;F</div>
        </div>`;
    }
  });

  weatherForecastE.innerHTML = otherDayForecast;
}
