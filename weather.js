const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    currentLocation = document.getElementById("location"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibilty = document.querySelector(".visibilty"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibilty-status"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    weatherCards = document.querySelector("#weather-cards");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";

// function to get date and time
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
   
    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}


date.innerText = getDateTime();
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);


function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {},
    })
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        })
        .catch((err) => {
            console.error(err);
        });
}

getPublicIp();

// function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {

    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=WD3LYMFXGJW7NLX3JEFAUCP27&contentType=json`,
        {
            method: "GET",
            headers: {},
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "Perc - " + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            measureUvIndex(today.uvindex);
            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            humidity.innerText = today.humidity + "%";
            updateHumidityStatus(today.humidity);
            visibilty.innerText = today.visibility;
            updateVisibiltyStatus(today.visibility);
            airQuality.innerText = today.winddir;
            updateAirQualityStatus(today.winddir);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            } else {
                updateForecast(data.days, unit, "week");
            }
            sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
        })

}

//function to update Forecast
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
                <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  `;
        weatherCards.appendChild(card);
        day++;
    }
}


function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
        return "https://i.ibb.co/rb4rrJL/26.png";
    }
}

// function to change background depending on weather conditions
function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    } else if (condition === "partly-cloudy-night") {
        bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
    } else if (condition === "rain") {
        bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
    } else if (condition === "clear-day") {
        bg = "https://i.ibb.co/WGry01m/cd.jpg";
    } else if (condition === "clear-night") {
        bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
    } else {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    }
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}

//get hours from hh:mm:ss
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

// convert time to 12 hour format
function covertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

// function to get day name from date
function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

// function to get uv index status
function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

// function to get humidity status
function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

// function to get visibility status
function updateVisibiltyStatus(visibility) {
    if (visibility <= 0.03) {
        visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

// function to get air quality status
function updateAirQualityStatus(airquality) {
    if (airquality <= 50) {
        airQualityStatus.innerText = "Good👌";
    } else if (airquality <= 100) {
        airQualityStatus.innerText = "Moderate😐";
    } else if (airquality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    } else if (airquality <= 200) {
        airQualityStatus.innerText = "Unhealthy😷";
    } else if (airquality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
        airQualityStatus.innerText = "Hazardous😱";
    }
}

// function to handle search form
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(location, currentUnit, hourlyorWeek);
    }
});

// function to conver celcius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}


var currentFocus;
search.addEventListener("input", function (e) {
    removeSuggestions();
    var a,
        b,
        i,
        val = this.value;
    if (!val) {
        return false;
    }
    currentFocus = -1;

    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    this.parentNode.appendChild(a);

    for (i = 0; i < cities.length; i++) {
       
        if (
            cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
        ) {
            b = document.createElement("li");
            b.innerHTML =
                "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
            b.innerHTML += cities[i].name.substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
            b.addEventListener("click", function (e) {
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            a.appendChild(b);
        }
    }
});
/*execute a function presses a key on the keyboard:*/
search.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions");
    if (x) x = x.getElementsByTagName("li");
    if (e.keyCode == 40) {
        
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
    } else if (e.keyCode == 38) {
       
        currentFocus--;
        
        addActive(x);
    }
    if (e.keyCode == 13) {
       
        e.preventDefault();
        if (currentFocus > -1) {
           
            if (x) x[currentFocus].click();
        }
    }
});
function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("active");
}
function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}

function removeSuggestions() {
    var x = document.getElementById("suggestions");
    if (x) x.parentNode.removeChild(x);
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

// function to change unit
function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        tempUnit.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            celciusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            celciusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});

//  change hourly to weekly or vice versa
function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}


// Cities add your own to get in search

cities = [
    {
        country: "PK",
        name: "Abbottabad",
        lat: "34.1463",
        lng: "73.21168",
    },
    {
        country: "PK",
        name: "Adilpur",
        lat: "27.93677",
        lng: "69.31941",
    },
    {
        country: "PK",
        name: "Ahmadpur East",
        lat: "29.14269",
        lng: "71.25771",
    },

    {
        country: "IND",
        name: "Goa",
        lat: "15.2993",
        lng: "74.1240",
    },

    {
        country: "IND",
        name: "Mumbai",
        lat: "19.0760",
        lng: "72.8777"
    },


    {
        country: "IND",
        name: "Delhi",
        lat: "28.6139",
        lng: "77.2090"
    },

    {
        country: "IND",
        name: "Bangalore",
        lat: "12.9716",
        lng: "77.5946"
    },


    {
        country: "IND",
        name: "Kolkata",
        lat: "22.5726",
        lng: "88.3639"
    },


    {
        country: "IND",
        name: "Chennai",
        lat: "13.0827",
        lng: "80.2707"
    },


    {
        country: "IND",
        name: "Hyderabad",
        lat: "17.3850",
        lng: "78.4867"
    },


    {
        country: "IND",
        name: "Ahmedabad",
        lat: "23.0225",
        lng: "72.5714"
    },


    {
        country: "IND",
        name: "Pune",
        lat: "18.5204",
        lng: "73.8567"
    },

    {
        country: "IND",
        name: "Jaipur",
        lat: "26.9124",
        lng: "75.7873"
    },


    {
        country: "IND",
        name: "Lucknow",
        lat: "26.8467",
        lng: "80.9462"
    },


    {
        country: "IND",
        name: "Kanpur",
        lat: "26.4499",
        lng: "80.3319"
    },


    {
        country: "IND",
        name: "Nagpur",
        lat: "21.1458",
        lng: "79.0882"
    },

    {
        country: "IND",
        name: "Indore",
        lat: "22.7196",
        lng: "75.8577"
    },

    {
        country: "IND",
        name: "Thane",
        lat: "19.2183",
        lng: "72.9781"
    },

    {
        country: "IND",
        name: "Bhopal",
        lat: "23.2599",
        lng: "77.4126"
    },

    {
        country: "IND",
        name: "Visakhapatnam",
        lat: "17.6868",
        lng: "83.2185"
    },

    {
        country: "IND",
        name: "Pimpri-Chinchwad",
        lat: "18.6279",
        lng: "73.8009"
    },


    {
        country: "IND",
        name: "Patna",
        lat: "25.5941",
        lng: "85.1376"
    },

    {
        country: "IND",
        name: "Ghaziabad",
        lat: "28.6692",
        lng: "77.4538"
    },

    {
        country: "IND",
        name: "Ludhiana",
        lat: "30.9010",
        lng: "75.8573"
    },

    {
        country: "IND",
        name: "Agra",
        lat: "27.1767",
        lng: "78.0081"
    },

    {
        country: "IND",
        name: "Nashik",
        lat: "20.0110",
        lng: "73.7909"
    },

    {
        country: "IND",
        name: "Faridabad",
        lat: "28.4089",
        lng: "77.3178"
    },


    {
        country: "IND",
        name: "Meerut",
        lat: "28.9845",
        lng: "77.7064"
    },

    {
        country: "IND",
        name: "Rajkot",
        lat: "22.3039",
        lng: "70.8022"
    },

    {
        country: "IND",
        name: "Kalyan-Dombivli",
        lat: "19.2350",
        lng: "73.1293"
    },

    {
        country: "IND",
        name: "Vasai-Virar",
        lat: "19.3910",
        lng: "72.8414"
    },

    {
        country: "IND",
        name: "Varanasi",
        lat: "25.3176",
        lng: "82.9739"
    },

    {
        country: "IND",
        name: "Srinagar",
        lat: "34.0837",
        lng: "74.7973"
    },

    {
        country: "IND",
        name: "Aurangabad",
        lat: "19.8762",
        lng: "75.3433"
    },

    {
        country: "IND",
        name: "Dhanbad",
        lat: "23.7957",
        lng: "86.4304"
    },

    {
        country: "IND",
        name: "Amritsar",
        lat: "31.6330",
        lng: "74.8723"
    },

    {
        country: "IND",
        name: "Navi Mumbai",
        lat: "19.0330",
        lng: "73.0297"
    },

    {
        country: "IND",
        name: "Allahabad",
        lat: "25.4358",
        lng: "81.8463"
    },

    {
        country: "IND",
        name: "Ranchi",
        lat: "23.3441",
        lng: "85.3096"
    },

    {
        country: "IND",
        name: "Howrah",
        lat: "22.5958",
        lng: "88.2636"
    },

    {
        country: "IND",
        name: "Coimbatore",
        lat: "11.0168",
        lng: "76.9558"
    },


    {
        country: "IND",
        name: "Jabalpur",
        lat: "23.1815",
        lng: "79.9864"
    },

    {
        country: "IND",
        name: "Gwalior",
        lat: "26.2183",
        lng: "78.1828"
    },

    {
        country: "IND",
        name: "Vijayawada",
        lat: "16.5062",
        lng: "80.6480"
    },

    {
        country: "IND",
        name: "Jodhpur",
        lat: "26.2389",
        lng: "73.0243"
    },


    {
        country: "IND",
        name: "Madurai",
        lat: "9.9252",
        lng: "78.1198"
    },

    {
        country: "IND",
        name: "Raipur",
        lat: "21.2514",
        lng: "81.6296"
    },

    {
        country: "IND",
        name: "Kota",
        lat: "25.2138",
        lng: "75.8648"
    },

    {
        country: "IND",
        name: "Guwahati",
        lat: "26.1445",
        lng: "91.7362"
    },

    {
        country: "IND",
        name: "Chandigarh",
        lat: "30.7333",
        lng: "76.7794"
    },

    {
        country: "IND",
        name: "Solapur",
        lat: "17.6599",
        lng: "75.9064"
    },

    {
        country: "IND",
        name: "Bareilly",
        lat: "28.3670",
        lng: "79.4304"
    },

    {
        country: "IND",
        name: "Moradabad",
        lat: "28.8389",
        lng: "78.7768"
    },

    {
        "country": "IND",
        "name": "Arunachal Pradesh",
        "lat": "27.103277",
        "lng": "93.655023"
    },
    {
        "country": "IND",
        "name": "Assam and Meghalaya",
        "lat": "25.258942",
        "lng": "92.45739"
    },
    {
        "country": "IND",
        "name": "Bihar",
        "lat": "25.090359",
        "lng": 85.321166
    },
    {
        "country": "IND",
        "name": "Chhattisgarh",
        "lat": 21.283517,
        "lng": 81.287004
    },
    {
        "country": "IND",
        "name": "Coastal Andhra Pradesh",
        "lat": 16.877228,
        "lng": 80.255115
    },
    {
        "country": "IND",
        "name": "Coastal Karnataka",
        "lat": 12.672627,
        "lng": 74.94076
    },
    {
        "country": "IND",
        "name": "East Madhya Pradesh",
        "lat": 23.171423,
        "lng": 80.631561
    },
    {
        "country": "IND",
        "name": "East Rajasthan",
        "lat": 25.521998,
        "lng": 74.580475
    },
    {
        "country": "IND",
        "name": "East Uttar Pradesh",
        "lat": 27.168401,
        "lng": 82.928223
    },
    {
        "country": "IND",
        "name": "Gangetic West Bengal",
        "lat": 22.632308,
        "lng": 88.342737
    },
    {
        "country": "IND",
        "name": "Gujarat Region",
        "lat": 23.022701,
        "lng": 72.861511
    },
    {
        "country": "IND",
        "name": "Haryana, Delhi & Chandigarh",
        "lat": 28.704112,
        "lng": 77.102496
    },
    {
        "country": "IND",
        "name": "Himachal Pradesh and Jammu & Kashmir",
        "lat": 32.165278,
        "lng": 75.820905
    },
    {
        "country": "IND",
        "name": "Jharkhand",
        "lat": 23.802172,
        "lng": 85.28984
    },
    {
        "country": "IND",
        "name": "Kerala",
        "lat": 10.082794,
        "lng": 76.279102
    },
    {
        "country": "IND",
        "name": "Konkan & Goa",
        "lat": 15.670481,
        "lng": 73.994873
    },
    {
        "country": "IND",
        "name": "Lakshadweep",
        "lat": 10.594144,
        "lng": 72.65625
    },
    {
        "country": "IND",
        "name": "Madhya Maharashtra",
        "lat": 20.124222,
        "lng": 76.019043
    },

    {
        "country": "IND",
        "name": "North Interior Karnataka",
        "lat": 15.391019,
        "lng": 76.162781
    },
    {
        "country": "IND",
        "name": "Orissa",
        "lat": 20.984718,
        "lng": 85.226257
    },
    {
        "country": "IND",
        "name": "Punjab",
        "lat": 31.175404,
        "lng": 75.34549
    },
    {
        "country": "IND",
        "name": "Saurashtra & Kutch",
        "lat": 22.263934,
        "lng": 72.19812
    },
    {
        "country": "IND",
        "name": "South Interior Karnataka",
        "lat": 13.099143,
        "lng": 75.698792
    },


    {
        "country": "IND",
        "name": "Sub Himalayan West Bengal & Sikkim",
        "lat": 27.082575,
        "lng": 88.377844
    },
    {
        "country": "IND",
        "name": "Tamil Nadu",
        "lat": 11.127123,
        "lng": 78.656891
    },
    {
        "country": "IND",
        "name": "Telangana",
        "lat": 17.390433,
        "lng": 78.472034
    },
    {
        "country": "IND",
        "name": "Uttarakhand",
        "lat": 29.946365,
        "lng": 78.20979
    },
    {
        "country": "IND",
        "name": "Vidarbha",
        "lat": 21.384536,
        "lng": 78.430817
    },
    {
        "country": "IND",
        "name": "West Madhya Pradesh",
        "lat": 23.171423,
        "lng": 77.627258
    },
    {
        "country": "IND",
        "name": "West Rajasthan",
        "lat": 26.916325,
        "lng": 74.232239
    },
    {
        "country": "IND",
        "name": "West Uttar Pradesh",
        "lat": 28.059455,
        "lng": 77.237457
    },

];


