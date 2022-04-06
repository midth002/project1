var brewData = $(".brewData")
var searchCity = $(".input")
var searchButton = $("#city-button")
var weatherData = $(".weatherData")
var weatherContainer = $(".weatherContainer")
var locationButton = $("#location-button")

var checkboxes = $('input[type=checkbox')

var apiKey = "385e58697effddc1169cee4d7d6e5489"
var perPage = "5"

var favoriteArray = []
var storedFavorites

var favoriteLabel = $("<label class='checkbox'>")
var favoriteInput = $("<input type='checkbox' class='favorite'>")

function init() {
    removeCard(); 
    // initByLocation();
    
}

function initByLocation() {
    var param = document.location.search.split('=')
    var query = param[1].split('&lon')

    var queryLat = query[0]
    var queryLon = param[2]
    breweryApiByDistance(queryLat, queryLon)
    
    
}

function removeParam() {
    var queryString = "./results.html?"
    location.assign(queryString);
}

function initForCity() {
    var searchParamArr = document.location.search.split('?q=')
    var initialSearch = searchParamArr[1];
    getBreweryApi(initialSearch);
    getWeatherByCity(initialSearch)
}

function getBreweryApi(city) {

    var brewUrl = "https://api.openbrewerydb.org/breweries?per_page=" + perPage + "&by_city=" + city
    fetch(brewUrl)
        .then(function (response) {
            return response.json();
        })  
        .then(function (data) { 
            console.log(data)
            createBrewCard(data)
        })
    
}

function filterApi(city, type) {

    var brewUrl = "https://api.openbrewerydb.org/breweries?per_page=" + perPage + "&by_city=" + city + "&by_type=" + type
    fetch(brewUrl)
        .then(function (response) {
            return response.json();
        })  
        .then(function (data) { 
            console.log(data)
            createBrewCard(data)
        })
    
}
 
function getUserLocation() {
    if ("geolocation" in navigator){ //check geolocation available 
        //try to get user current location using getCurrentPosition() method
        navigator.geolocation.getCurrentPosition(function(position){ 
            var brewType = $('#brewTypeOption').children("option:selected").val()
            console.log("Found your location \nLat : "+position.coords.latitude+" \nLang :"+ position.coords.longitude);
            if (brewType === "" || brewType === "all") {
                breweryApiByDistance(position.coords.latitude, position.coords.longitude)
                weatherOneCall(position.coords.latitude, position.coords.longitude, "Your Location")
            } else {
                filterDistApi(position.coords.latitude, position.coords.longitude, brewType)
            }
                
            });
    }else{
        console.log("Browser doesn't support geolocation!");
    }
}

function breweryApiByDistance(lat, lon) {
   var distUrl = "https://api.openbrewerydb.org/breweries?by_dist=" + lat + "," + lon + "&per_page=" + perPage 

   fetch(distUrl)
   .then(function (response) {
       return response.json();
   })  
   .then(function (data) { 
       createBrewCard(data)
   })
}

function filterDistApi(lat, lon, type) {
    var distTypeUrl = "https://api.openbrewerydb.org/breweries?by_dist=" + lat + "," + lon + "&per_page=" + perPage + "&by_type=" + type 

    fetch(distTypeUrl)
    .then(function (response) {
        return response.json();
    })  
    .then(function (data) { 
        createBrewCard(data)
    })
}

function createBrewCard(data) {
    for (i=0; i < data.length; i++) {
                
        var brewDiv = $('<div>').addClass("brewCard");
        var brewName = $("<h3>");
        var favoriteLabel = $("<label class='checkbox'>")
        var favoriteInput = $("<input type='checkbox' class='favorite'>")
       
        var ul = $('<ul>');
        var li1 = $('<li>');
        var li2 = $('<li>');
        var li3 = $('<li class="brew-city">');
        
        var li5 = $('<li>'); 
        var brewLink = $('<a>');
        brewLink.attr("href" , data[i].website_url)
        brewLink.text("Visit Website");

        brewName.text(data[i].name);
        favoriteLabel.text("Favorites ")
        li1.text("Brewery Type: " + data[i].brewery_type);
        li2.text("Street Address: " + data[i].street);
        li3.text(data[i].city + " " + data[i].state);
        
        
        brewName.attr("style", "font-size: 2rem", "font-weight: bolder");
        brewDiv.attr("style", "border: 5px dotted gold; margin: 10px; width: 100%; padding: 10px;");
        //ul.children().attr("style", "position: center")

        favoriteLabel.append(favoriteInput);
        li5.append(brewLink);
        ul.append(li1, li2, li3, li5) ;
        brewDiv.append(brewName, ul, favoriteLabel);
        brewData.append(brewDiv);

        
    }

    checkFavorite();
 
}

function checkFavorite() {
    $('input.favorite').on('change', function(){
        var thisBrewCard = $(this).parents('.brewCard')
            var thisBrewName = thisBrewCard.children('h3').text()
            var thisUl = thisBrewCard.children('ul')
            var thisCityName = thisUl.children('.brew-city').text()
        if($(this).is(':checked')){
            setLocalStorage(thisBrewName, thisCityName)
        } else {
            removeFromLocalStorage(thisBrewName)
            
        }
    }); 
}

function getWeatherByCity(name) {
    
    var latLonUrl =  "https://api.openweathermap.org/geo/1.0/direct?q="+ name +"&limit=1&appid=" + apiKey

    fetch(latLonUrl) 
        .then(function (response) {
            return response.json();
        })

        .then(function (data) { 
            console.log(data)
             var lat1 = data[0].lat.toString()
             var lon1 = data[0].lon.toString()

             weatherOneCall(lat1, lon1, name)

        })
}

function weatherOneCall(lat, lon, name) { 
        var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"

        fetch(weatherUrl) 
           .then(function (response) {
               return response.json();
           })
            .then(function (data) {
                   var sunset = data.current.sunset

                 // Current weather element created
                 var currentDiv = $('<div>').addClass("weatherCard");
                 var weatherTitle = $('<h4>')
                 var iconSpan = $('<span>')
                 var currentWeatherIcon = $('<i>')
                 var currentUl = $('<ul>')
                 var tempLi = $("<li>")
                 var windLi = $("<li>")
                 var humLi = $("<li>")
                 var uvLi = $("<li>")
                 var sunsetLi = $("<li>")

                // Add text to weather elements
                 weatherTitle.text("Currently in " + name + "  ")
                 tempLi.text("Temp: " + data.current.temp.toFixed() + "°F")
                 windLi.text("Wind: " + data.current.wind_speed.toFixed() + " MPH")
                 humLi.text("Humidity: " + data.current.humidity + "%")
                 uvLi.text("UV Index: " + data.current.uvi)
                 sunsetLi.text("Sunset: " + convertUnixTime(sunset))
                 currentWeatherIcon.html("<img src='https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png' alt='Icon depicting current weather.'>");
                 

                 currentDiv.attr("style", "background-color: white;")
                 iconSpan.attr("style", "margin-left: 5px;")

                // Append elements to the weathercontainer
                iconSpan.append(currentWeatherIcon);
                weatherTitle.append(iconSpan)
                currentUl.append(tempLi, windLi, humLi, uvLi, sunsetLi)
                currentDiv.append(weatherTitle, currentUl)
                weatherData.append(currentDiv)
                weatherContainer.append(weatherData)
                
               // 5 day forecast loop
                 for (i=1; i < 6; i++) {
                     var unix = data.daily[i].dt
                     var forecastDate = dateFormatter(unix);
                     var day = moment(forecastDate, "M/D/YYYY").format("ddd")
                    console.log(day)
                } 
            })
}

function convertUnixTime(unixTime) {
    var time = new Date(unixTime)
    var timeString = time.toLocaleTimeString("en-US")
    return timeString;
}

function dateFormatter(unixTime) {
    var date = new Date(unixTime * 1000)
    var dateString = date.toLocaleDateString("en-US")
    return dateString;
}

function removeCard() {
    $(".brewCard").remove();
    $(".weatherCard").remove();
}

searchButton.on("click", function(e) {
    e.preventDefault();
    var searchValue = searchCity.val().trim()
    if(!searchValue) {
        alert('You need to enter a city or search by location'); 
        return;
    } else {
    removeCard();
    getWeatherByCity(searchCity.val().trim());
    var brewType = $('#brewTypeOption').children("option:selected").val()
    if (brewType === "" || brewType === "all") {
        getBreweryApi(searchCity.val().trim());
    } else {
        filterApi(searchCity.val().trim(), brewType)
    } }
})

locationButton.on("click" , function(e) { 
    e.preventDefault();
    removeCard();
    getUserLocation();
    
})

function setLocalStorage(name, city) {
    favoriteArray.push({
        breweryName: name,
        breweryCity: city
    })

    localStorage.setItem("favorites", JSON.stringify(favoriteArray))
}

function getLocalStorage() {
    storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    console.log(storedFavorites);
}

function removeFromLocalStorage(storedName) {
    for (i=0; i < favoriteArray.length; i++) {
        if (favoriteArray[i].breweryName == storedName) {
            favoriteArray.splice(i, 1)
            localStorage.setItem("favorites", JSON.stringify(favoriteArray))
        }
    }
}

init();