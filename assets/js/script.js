var brewData = $(".brewData")

var apiKey = "385e58697effddc1169cee4d7d6e5489"

function getBreweryApi(city) {

    var brewUrl = "https://api.openbrewerydb.org/breweries?per_page=5&by_city=" + city
    fetch(brewUrl)
        .then(function (response) {
            return response.json();
        })  
        .then(function (data) { 
            createBrewCard(data)
        })
    
}

function createBrewCard(data) {
    for (i=0; i < data.length; i++) {
                
        var brewDiv = $('<div>')
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
        li1.text(data[i].brewery_type);
        li2.text(data[i].street);
        li3.text(data[i].city);
        li4.text(data[i].state);
        
        brewName.attr("style", "font-weight: bold");
        brewDiv.attr("style", "border: 2px solid black; margin: 2px; width: 20%;");

        li5.append(brewLink);
        ul.append(li1, li2, li3, li4, li5);
        brewDiv.append(brewName, ul)
        brewData.append(brewDiv);
             
    }
}

function getWeatherByCity(city) {
    
    var latLonUrl =  "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey

    fetch(latLonUrl) 
        .then(function (response) {
            return response.json();
        })

        .then(function (data) { 
            lat = data[0].lat.toString()
            lon = data[0].lon.toString()

            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=385e58697effddc1169cee4d7d6e5489&units=imperial"

            fetch(weatherUrl) 
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    console.log("------ Current Weather --------")
                    console.log("Temp: " + data.current.temp.toFixed() + "°F")
                    console.log("Wind: " + data.current.wind_speed.toFixed() + " MPH")
                    console.log("Humidity: " + data.current.humidity + "%")
                    console.log("UV Index: " + data.current.uvi) 
                    var sunset = data.current.sunset
                    console.log("Sunset: " + convertUnixTime(sunset))
                    console.log("------ Weekend Forecast --------")

                    for (i=1; i < 5; i++) {
                        var unix = data.daily[i].dt
                        var forecastDate = dateFormatter(unix);
                        console.log(forecastDate)

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

getBreweryApi("Minneapolis");
getWeatherByCity("Minneapolis");
