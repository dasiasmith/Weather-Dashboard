var apiUrl = 'api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}';
var apiKey = 'b16d1a940a0bfae041e89cabfa2d0485';
var today = moment().format('L');

var citiesList = document.querySelector("#citiesList");
var oneDay = document.querySelector("#oneDay");
var dayGroup = document.querySelector("#dayGroup");
var fiveHeading = document.querySelector("#fiveHeading");
var fiveForecast = document.querySelector("#fiveForecast");

var content = document.createElement("div");
var temp = document.createElement("p");
var wind = document.createElement("p");
var humid = document.createElement("p");
var uv = document.createElement("p");

var searchHistory = [];

function getHistory() {
    var localStor = localStorage.getItem('history')
    if (localStor) {
        searchHistory = JSON.parse(localStor)
    }
    citiesList.innerHTML = " ";
    for (var i = 0; i < searchHistory.length; i++) {
        showList(searchHistory[i])
    }
}

//Weather info for current day
function dayData(city) {
    console.log("searchcurr:", city)
    fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}')
    .then(function (response) {
        if (response.ok) {
            console.log(response)
            response.json().then(function (data) {
                if (searchHistory.indexOf(city) === -1) {
                    searchHistory.push(city)
                    localStorage.setItem("history", JSON.stringify(searchHistory));
                    getHistory()
                }

                var cityDate = document.createElement("div");
                var pic = document.createElement("img");
                var picUrl = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
                
                cityDate.innerHTML = city + " " + today;
                cityDate.appendChild(pic);
                pic.setAttribute("src", picUrl);
            })
        }
    }
}