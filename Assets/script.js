var apiUrl = 'api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}';
var apiKey = 'b16d1a940a0bfae041e89cabfa2d0485';
var today = moment().format('L');

var citiesList = document.querySelector("#citiesList");
var oneDay = document.querySelector("#oneDay");
var dayGroup = document.querySelector("#dayGroup");
var fiveHeading = document.querySelector("#fiveHeading");
var fiveForecast = document.querySelector("#fiveForecast");
var fiveCard = document.querySelector("#fiveCard");

var content = document.createElement("div");
var temp = document.createElement("p");
var wind = document.createElement("p");
var humid = document.createElement("p");
var uv = document.createElement("p");

var searchHistory = [];

function getHistory() {
    var localStor = localStorage.getItem("name")
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
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=b16d1a940a0bfae041e89cabfa2d0485')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (searchHistory.indexOf(city) === -1) {
                    searchHistory.push(city)
                    localStorage.setItem("name", JSON.stringify(searchHistory));
                    getHistory()
                }

                var cityDate = document.createElement("div");
                var pic = document.createElement("img")
                var picUrl = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
                pic.setAttribute("src", picUrl)

                cityDate.innerHTML = city + " " + today;
                cityDate.appendChild(pic)

                oneDay.innerHTML = "";
                oneDay.appendChild(cityDate);

                dayGroup.innerHTML = "";
                content.innerHTML = "";

                uvData(data.coord.lat, data.coord.lon);

                temp.textContent = "Temp: " + data.main.temp + " °F";
                wind.textContent = "Wind: " + data.wind.speed + " MPH";
                humid.textContent = "Humidity: "+ data.main.humidity + " %";

                dayGroup.classList = "card";

                content.appendChild(oneDay);
                content.appendChild(temp);
                content.appendChild(wind);
                content.appendChild(humid);
                dayGroup.appendChild(content);
            })
        }else {
            alert("Error " + response.statusText)
        }
    }).catch(function (error) {
        alert("Error " + error.statusText)
    })
}

function uvData(lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/uvi?appid=b16d1a940a0bfae041e89cabfa2d0485&lat=' + lat + '&lon=' + lon)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var uvBtn = document.createElement("button");
                uvBtn.classList.add("btn");
                uvBtn.textContent = data.value;

                if (data.value < 3) {
                    uvBtn.classList.add("good");
                }else if (data.value < 7) {
                    uvBtn.classList.add("bad");
                }else {
                    uvBtn.classList.add("ugly");
                }

                var uvIndex = document.createElement("div");
                uvIndex.innerText = "UV Index: ";
                uvIndex.appendChild(uvBtn);

                content.appendChild(uvIndex);
                dayGroup.appendChild(content);
            })
        }else {
            alert("Error: " + response.statusText)
        }
    }).catch(function (error) {
        alert("Error " + error.statusText)
    })
}

function getFiveDay(city) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=b16d1a940a0bfae041e89cabfa2d0485')
    .then(function (response) {
        console.log(response)
        if (response.ok) {
            response.json().then(function (data) {
                var fiveTitle = document.createElement("h2");
                fiveHeading.textContent = "";

                fiveTitle.textContent = "5-Day Forecaset:"
                fiveHeading.appendChild(fiveTitle)

                for (var i = 6; i < 39; i += 8) {
                    var divEl = document.createElement("div")
                    var fiveImg = document.createElement("img")
                    var fiveTemp = document.createElement("p")
                    var fiveWind = document.createElement("p")
                    var fiveHum = document.createElement("p")
                    var fiveDate = document.createElement("h4")

                    fiveDate.textContent = data.list[i].dt_txt.split(" ")[0];
                    fiveDate.classList = "fiveDates";
                    fiveImg.setAttribute("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
                    fiveImg.classList = "fiveImgs";
                    fiveTemp.textContent = "Temp: " + data.list[i].main.temp + " °F";
                    fiveWind.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
                    fiveHum.textContent = "Humidity: " + data.list[i].main.humidity + " %";
                    divEl.classList = 'col-md-2 style';

                    divEl.appendChild(fiveDate);
                    divEl.appendChild(fiveImg);
                    divEl.appendChild(fiveTemp);
                    divEl.appendChild(fiveWind);
                    divEl.appendChild(fiveHum);
                    fiveCard.appendChild(divEl);
                }
            })
            fiveCard.innerHTML = "";
        }else {
            alert("Error " + response.statusText)
        }
    }).catch(function (error) {
        alert("Error " + error.statusText)
    })
}

var showList = function(userCity) {
    var inputOne = document.createElement("button")
    inputOne.classList = "list-group-item list-group-item-action";
    inputOne.textContent = userCity;
    citiesList.appendChild(inputOne);
}

document.getElementById("citiesList").addEventListener("click", function(event) {
    dayData(event.target.textContent);
    getFiveDay(event.target.textContent);
})

document.getElementById("searchButt").addEventListener("click", function (event) {
    event.preventDefault();

    var userCity = document.getElementById("city").value;
    document.getElementById("city").value = "";
    userCity = userCity.toUpperCase();

    if (userCity) {
        dayData(userCity);
        getFiveDay(userCity);
    }else {
        alert("Please enter City")
    }
})

getHistory();