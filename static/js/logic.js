
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
function onEachFeature(feature, layer) {
  layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
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
   function getColor(mag){
    if (mag > 5.0)
      return "red";
    else if (mag > 4.0)
      return "blue";
    else if (mag > 3.0)
      return "DarkOrange";
    else if (mag > 2.0)
      return "gold";  
    else if (mag > 1.0)
      return "yellow";
    else 
      return "greenyellow"   
    }

}
// Create a GeoJSON layer 
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

// Define grayscale, satellite and outdoors layers
var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: "pk.eyJ1IjoicGF0ZWxyb21hNTAxIiwiYSI6ImNrZDlwMmhwejA0ejYyd29iYjkzM2g1NmUifQ.ItFKV0V_qlrMeuFAisNtAA"
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: "pk.eyJ1IjoicGF0ZWxyb21hNTAxIiwiYSI6ImNrZDlwMmhwejA0ejYyd29iYjkzM2g1NmUifQ.ItFKV0V_qlrMeuFAisNtAA"
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: "pk.eyJ1IjoicGF0ZWxyb21hNTAxIiwiYSI6ImNrZDlwMmhwejA0ejYyd29iYjkzM2g1NmUifQ.ItFKV0V_qlrMeuFAisNtAA"
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "GrayScale Map": grayscale,
  "Satellite Map": satellite,
  "Outdoors Map": outdoors
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the satellite and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 4,
  layers: [satellite, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);



// Set Up Legend
var legend = L.control({position: 'bottomright'});

function getColor(mag){
  if (mag > 5.0)
    return "red";
  else if (mag > 4.0)
    return "blue";
  else if (mag > 3.0)
    return "DarkOrange";
  else if (mag > 2.0)
    return "gold";  
  else if (mag > 1.0)
    return "yellow";
  else 
    return "greenyellow"   
  }

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    Magnitude = [0, 1, 2, 3, 4, 5],
    labels = [];
    

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < Magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(Magnitude[i] + 1) + '"></i> ' +
           Magnitude[i] + (Magnitude[i + 1] ? '&ndash;' + Magnitude[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);
}