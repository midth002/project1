
var searchCity = $(".input")
var searchButton = $(".button")

function searchFormSubmitCity(e) {
    e.preventDefault();
    var searchCityVal = searchCity.val();

    if (!searchCityVal) {
        console.error("No city value in. You need to put in a value!");
        return
    } 
    var queryString = "./results.html?q=" + searchCityVal 
    location.assign(queryString)
}

searchButton.on("click", searchFormSubmitCity);