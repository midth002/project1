function getApi(city) {

    var url = "https://api.openbrewerydb.org/breweries?by_city=" + city
    fetch(url)
        .then(function (response) {
            return response.json();
        })  
        .then(function (data) { 
            console.log(data)
            console.log(url)
        })
    
}


getApi("Minneapolis")
