// GLOBAL VARIABLES //
var citySearchFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var cityHistoryListEl = document.querySelector("#history-list");
var currentCityTitleEl = document.querySelector("#current-city-title");
var cIconEl = document.querySelector("#c-icon")
var cTempEl = document.querySelector("#c-temp");
var cWindEl = document.querySelector("#c-wind");
var cHumidityEl = document.querySelector("#c-humidity");
var cUviEl = document.querySelector("#c-uv-index");
var fiveDayContainerEl = document.querySelector("#five-day-container");
var buttonId = 0;

// ARRAYS //
var cityHistoryAr = [];




// FUNCTIONS //
// Send to city history list
var cityHistoryList = function (city) {
  var cityInHistory = document.createElement("button");
  cityInHistory.setAttribute("type", "button");
  cityInHistory.classList = "btn btn-secondary mb-2 w-100"
  cityInHistory.id = city.zip;
  cityInHistory.textContent = city.name;
  cityHistoryListEl.prepend(cityInHistory);



  cityHistoryAr.push(city);
  localStorage.setItem("search history", JSON.stringify(cityHistoryAr));

  cityInHistory.addEventListener("click", function(e) {
    fiveDayContainerEl.textContent = "";
    getWeatherInfo(city.lat, city.lon, city.name);
  })
}


// Fetch //
// convert zip code to coordinates and send to getWeatherInfo
var getCityCoordinates = function(city) {
  var corApiUrl = 
  "https://api.openweathermap.org/geo/1.0/zip?zip=" + city + "&appid=69cc0b96ff0a7672acd0f2ad83fc81b4"

  fetch(corApiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        cityHistoryList(data);
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
var getWeatherInfo = function (lat, lon, name) {
  var wetApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude={part}&appid=69cc0b96ff0a7672acd0f2ad83fc81b4";
  
  fetch(wetApiUrl).then(function(response) {
    response.json().then(function(data) {
      var currentIcon = data.current.weather[0].icon;
      var currentTemp = data.current.temp + " °F"; 
      var currentWind = data.current.wind_speed + " MPH";
      var currentHumidity = data.current.humidity + " %";
      var currentUvindex = data.current.uvi;
      displayCurrentWeather(name, currentIcon, currentTemp, currentWind, currentHumidity, currentUvindex)

      // forcasts
      displayForecasts(data.daily.slice(1, 6));
    });
  });
}



// Display //
// display current weather on hmtl
var displayCurrentWeather = function (name ,icon, temp, wind, humidity, uv) {
  cIconEl.textContent = "";
  
  currentCityTitleEl.textContent = name + " " + moment().format("LL");
  var cIcon = document.createElement("img");
  cIcon.setAttribute("src", "assets/images/" + icon + ".png");
  cIconEl.appendChild(cIcon);
  cTempEl.textContent = "Temp: " + temp;
  cWindEl.textContent = "Wind: " + wind;
  cHumidityEl.textContent = "Humidity: " + humidity;
  cUviEl.textContent = uv;
  if (uv < 3) {
    cUviEl.classList = "m-1 p-1 bg-success text-white w-auto rounded";
  } else if (uv > 2 && uv < 8) {
    cUviEl.classList = "m-1 p-1 bg-warning text-white w-auto rounded";
  } else if (uv > 7) {
    cUviEl.classList = "m-1 p-1 bg-danger text-white w-auto rounded";
  };
}

var displayForecasts = function(forecasts) {
  for (i = 0; i < forecasts.length; i++) {
    var dayDiv = document.createElement("div");
    dayDiv.classList = " card m-1";
    dayDiv.id = "days";

    var dayDivHeader = document.createElement("div");
    dayDivHeader.classList = "card-header fw-bold";
    dayDivHeader.textContent = moment.unix(forecasts[i].dt).format("ddd l");
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
}

var loadButtons = function () {
  var namesHistory = JSON.parse(localStorage.getItem("search history"));
  if (!namesHistory) {
    return;
  }

  for (i = 0; i < namesHistory.length; i++) {
    cityHistoryList(namesHistory[i]);
  }
}




 // HANDLERS //
var citySubmitHandler = function(event){
  event.preventDefault();

  var cityZip = cityInputEl.value.trim();
  if (cityZip) {
    getCityCoordinates(cityZip);
    fiveDayContainerEl.textContent = "";
    cityInputEl.value = "";
  } else {
    alert("Please enter a valid Zip Code");
  }
}




// LISTENERS //





// CALLS //
citySearchFormEl.addEventListener("submit", citySubmitHandler);
loadButtons();
