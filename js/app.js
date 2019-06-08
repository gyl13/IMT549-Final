// Create the map object, set the view and zoom
const mymap = L.map("mapid").setView([37.43, -122.1674], 11.5);

// Add the background tiles to the map
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken:
      "pk.eyJ1Ijoibmlja2RlbmFyZGlzIiwiYSI6ImNqaGRla2pjMjBvYXgzNm13Yzc3aGIwM3kifQ.G2Tr-B7ppCNdj6xuM0Qc5A"
  }
).addTo(mymap);



//Render Table

function renderProp(content, nonNumeric) { //Create cell
  var newCell = document.createElement("td");  
  newCell.textContent = content;
  if(nonNumeric){
      newCell.classList.add("non-numeric");
  }
  return newCell;
} 

function renderLocation(property) {       //create row
  var newRow = document.createElement("tr");
  newRow.appendChild(renderProp(property.area, true));
  newRow.appendChild(renderProp(property.address, true));
  newRow.appendChild(renderProp(property.manager, true));
  newRow.appendChild(renderProp(property.rent, false));
  newRow.appendChild(renderProp(property.notes, true));
  return newRow;
}  

function renderList(property_list) {       //create list
  var tableBody = document.querySelector("tbody");
  tableBody.textContent = "";
  for (var count = 0; count < property_list.length; count++){
      var eachLocation = property_list[count];
      tableBody.appendChild(renderLocation(eachLocation));
  } 
}                                   


PROPERTIES.sort(function(a,b){ //Sort by rent
  return a.rent - b.rent
});

renderList(PROPERTIES); //render list of locations



var newSearch = document.getElementById("property-filter"); //get search


function searchLocations(location){
  
  var searchInput = newSearch.value.toLowerCase();
    
  var areas = location.area.toLowerCase();
  var addresses = location.address.toLowerCase();
  var managers = location.manager.toLowerCase();

  if(areas.indexOf(searchInput) > -1){ //search by area
      return true;
  }
  else if(addresses.indexOf(searchInput) > -1){ //search by address
    return true;
}
else if(managers.indexOf(searchInput) > -1){ //search by manager
  return true;
} 
  else{
      return false;
  }
}

// Render the markers

var markerGroup = L.layerGroup(); //create marker group

function renderMarkers(data) {
  markerGroup.clearLayers();
  data.forEach(function(marker){
     incident = L.marker([marker.latitude, marker.longitude]); //create marker
     incident.bindPopup("<b>"+marker.address+"</b><br>" + marker.type + "<br>" + "$"+marker.rent).openPopup();
    incident.addTo(markerGroup);
    markerGroup.addTo(mymap);
 
   })
 
 
}


 newSearch.addEventListener("input", function(){
  var resultArray = PROPERTIES.filter(searchLocations);    
  renderList(resultArray);  //render table of search results
  renderMarkers(resultArray); //render markers for search results
}); 
