// GLOBAL VARIABLES //
var citySearchFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var cityHistoryListEl = document.querySelector("#history-list");
var currentCityTitleEl = document.querySelector("#current-city-title");
var cTempEl = document.querySelector("#c-temp");
var cWindEl = document.querySelector("#c-wind");
var cHumidityEl = document.querySelector("#c-humidity");
var cUviEl = document.querySelector("#c-uv-index");
var fiveDayContainerEl = document.querySelector("#five-day-container");

// ARRAYS //
var fiveDayAr = [];
var cityHistoryAr = [];




// FUNCTIONS //
// Send to city history list
var cityHistoryList = function (city) {
  var cityInHistory = document.createElement("button");
  cityInHistory.setAttribute("type", "button");
  cityInHistory.classList = "btn btn-secondary d-flex justify-content-center mb-2 w-100"
  cityInHistory.textContent = city;
  cityHistoryListEl.appendChild(cityInHistory);
}



// Fetch //
// convert zip code to coordinates and send to getWeatherInfo
var getCityCoordinates = function(city) {
  var corApiUrl = 
  "https://api.openweathermap.org/geo/1.0/zip?zip=" + city + "&appid=69cc0b96ff0a7672acd0f2ad83fc81b4"

  fetch(corApiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        cityHistoryList(data.name + ", " + data.country);
        var cityLat = data.lat;
        var cityLon = data.lon;
        var cityName = data.name;
        var country = data.country;
        getWeatherInfo(cityLat, cityLon, cityName, country);
      });
    } else {
      alert("Please enter a valid Zip Code")
      return;
    }
  });
}

// get weather info and send to displayWeatherInfo
var getWeatherInfo = function (lat, lon, name, country) {
  var wetApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude={part}&appid=69cc0b96ff0a7672acd0f2ad83fc81b4";
  
  fetch(wetApiUrl).then(function(response) {
    response.json().then(function(data) {
      var currentTemp = data.current.temp + " °F"; 
      var currentWind = data.current.wind_speed + " MPH";
      var currentHumidity = data.current.humidity + " %";
      var currentUvindex = data.current.uvi;
      displayCurrentWeather(name, country, currentTemp, currentWind, currentHumidity, currentUvindex)

      // forcasts
      displayForecasts(data.daily.slice(1, 6));
    });
  });
}



// Display //
// display current weather on hmtl
var displayCurrentWeather = function (name ,country, temp, wind, humidity, uv) {
  currentCityTitleEl.textContent = name + ", " + country + " " + moment().format("LL");
  cTempEl.textContent = "Temp: " + temp;
  cWindEl.textContent = "Wind: " + wind;
  cHumidityEl.textContent = "Humidity: " + humidity;
  cUviEl.textContent = "UV Index: " + uv;

}

var displayForecasts = function(forecasts) {
  for (i = 0; i < forecasts.length; i++) {
    var dayDiv = document.createElement("div");
    dayDiv.classList = "col card m-1"

    var dayDivHeader = document.createElement("div");
    dayDivHeader.classList = "card-header";
    dayDivHeader.textContent = moment.unix(forecasts[i].dt).format("l");
    dayDiv.appendChild(dayDivHeader);

    var dayDivBody = document.createElement("div");
    dayDivBody.classList = "card-body";

    var dayDivIcon = document.createElement("img");
    dayDivIcon.setAttribute("src", "assets/images/" + forecasts[i].weather[0].icon + ".png");
    dayDivIcon.setAttribute("width", "50px")
    var dayDivTemp = document.createElement("p");
    dayDivTemp.textContent = "Temp: " + forecasts[i].temp.day + "°F";
    var dayDivWind = document.createElement("p");
    dayDivWind.textContent = "Wind: " + forecasts[i].wind_speed + " MPH";
    var dayDivHumidity = document.createElement("p");
    dayDivHumidity.textContent = "Humidity: " + forecasts[i].humidity + " %";
    dayDivBody.appendChild(dayDivIcon);
    dayDivBody.appendChild(dayDivTemp);
    dayDivBody.appendChild(dayDivWind);
    dayDivBody.appendChild(dayDivHumidity);

    dayDiv.appendChild(dayDivBody);
    fiveDayContainerEl.appendChild(dayDiv);
  }
  console.log(forecasts[2].weather[0].icon)
}




 // HANDLERS //
var citySubmitHandler = function(event){
  event.preventDefault();

  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityCoordinates(cityName);
    fiveDayContainerEl.textContent = "";
    cityInputEl.value = "";
  }
}




// LISTENERS //





// CALLS //
citySearchFormEl.addEventListener("submit", citySubmitHandler);
