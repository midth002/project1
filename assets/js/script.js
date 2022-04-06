var brewData = $(".brewData")
var searchCity = $(".input")
var searchButton = $(".button")
var weatherData = $(".weatherData")
var weatherContainer = $(".weatherContainer")

var apiKey = "385e58697effddc1169cee4d7d6e5489"
var perPage = "3"

function init() {
    var searchParamArr = document.location.search.split('?q=')
    var initialSearch = searchParamArr[1];
    getBreweryApi(initialSearch);
    getWeatherByCity(initialSearch);
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

function createBrewCard(data) {
    for (i=0; i < data.length; i++) {
                
        var brewDiv = $('<div>').addClass("brewCard");
        var brewName = $("<h3>");
        var ul = $('<ul>');
        var li1 = $('<li>');
        var li2 = $('<li>');
        var li3 = $('<li>');
        var li4 = $('<li>');
        var li5 = $('<li>'); 
        var brewLink = $('<a>');
        brewLink.attr("href" , data[i].website_url)
        brewLink.text("Website");

        brewName.text(data[i].name);
        li1.text("Brewery Type: " + data[i].brewery_type);
        li2.text("Street Address: " + data[i].street);
        li3.text(data[i].city + ",");
        li4.text(data[i].state);
        
        brewName.attr("style", "font-size: 2rem", "font-weight: bolder");
        brewDiv.attr("style", "border: 3px dashed ; margin: 2px; width: 35%; padding-left: 10px; padding-right: 10px; padding-bottom: 10px;");
        //ul.children().attr("style", "position: center")

        li5.append(brewLink);
        ul.append(li1, li2, li3, li4, li5);
        brewDiv.append(brewName, ul);
        brewData.append(brewDiv);
             
    }
}

function getWeatherByCity(name) {
    
    var latLonUrl =  "https://api.openweathermap.org/geo/1.0/direct?q="+ name +"&limit=1&appid=" + apiKey

    fetch(latLonUrl) 
        .then(function (response) {
            return response.json();
        })

        .then(function (data) { 
            console.log(data)
             lat = data[0].lat.toString()
             lon = data[0].lon.toString()

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
                      weatherTitle.text("Currently in: " + name + "  ")
                      tempLi.text("⁌Temperature: " + data.current.temp.toFixed() + "°F")
                      windLi.text("⁌Wind Speed: " + data.current.wind_speed.toFixed() + " MPH")
                      humLi.text("⁌Humidity: " + data.current.humidity + "%")
                      uvLi.text("⁌UV Index: " + data.current.uvi)
                      sunsetLi.text("⁌Sunset: " + convertUnixTime(sunset))
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
    removeCard();
    getBreweryApi(searchCity.val().trim());
    getWeatherByCity(searchCity.val().trim());

})

init();