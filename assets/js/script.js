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
                li2.text(data[i].brewery_type)
                li3.text(data[i].street)
                li4.text(data[i].website_url)

                ul.append(li1, li2, li3, li4)
                brewData.append(ul);
            }
          
            
        })
    
}

getApi("Minneapolis")
