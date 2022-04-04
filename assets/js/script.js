var brewData = $('#brewData')




function getApi(city) {

    var url = "https://api.openbrewerydb.org/breweries?per_page=1&by_city=" + city
    fetch(url)
        .then(function (response) {
            return response.json();
        })  
        .then(function (data) { 
            for (i=0; i < data.length; i++) {

                var ul = $('<ul>')
                var li1 = $('<li>')
                var li2 = $('<li>')
                var li3 = $('<li>')
                var li4 = $('<li>')

                li1.text(data[i].name)
                li1.text(data[i].brewery_type)
                li1.text(data[i].street)
                li1.text(data[i].website_url)
            }
        })
    
}





getApi("Minneapolis")
