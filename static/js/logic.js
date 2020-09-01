
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
}
function getColor(mag){
if (mag > 5.0)
  return "red";
else if (mag > 4.0)
  return "orange";
else if (mag > 3.0)
  return "yellow";
else if (mag > 2.0)
  return "blue";  
else if (mag > 1.0)
  return "purple";
else 
  return "green"   
}
function earthquakestyle(feature) {
   return {
     radius: feature.properties.mag*2,
     opacity: 1,
     stroke: true,
     fillColor: getColor(feature.properties.mag),
     color: "black",
     weight: 0.6,
     fillOpacity: 1
   }


}
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
var earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng)
    },
    style: earthquakestyle
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: "pk.eyJ1IjoicGF0ZWxyb21hNTAxIiwiYSI6ImNrZDlwMmhwejA0ejYyd29iYjkzM2g1NmUifQ.ItFKV0V_qlrMeuFAisNtAA"
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
  accessToken: "pk.eyJ1IjoicGF0ZWxyb21hNTAxIiwiYSI6ImNrZDlwMmhwejA0ejYyd29iYjkzM2g1NmUifQ.ItFKV0V_qlrMeuFAisNtAA"
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Satellite Map": satellite
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [satellite, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
}
