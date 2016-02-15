// myMapApp namespace to keep separate from outside js libraries.
var myMapApp = myMapApp || { }; //myMapApp namespace

// see bottom of file for MVVM structure.
$( function() {

    // initialize some variables
    myMapApp.markers = [];
    myMapApp.query = ko.observable("");

    // create the Google map
    myMapApp.createMap = function(){
        // set map options
        var myOptions = {
            zoom: myMapApp.model.zoomLevel,
            center: new google.maps.LatLng( myMapApp.model.centerCoordinates[0], myMapApp.model.centerCoordinates[1] ),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // create the Google map
        myMapApp.map = new google.maps.Map( $('#map')[0], myOptions);
    };

    // Delete the markers from the map.
    myMapApp.deleteMarkers = function () {
        //console.log("deleteMarkers markers.length",myMapApp.markers.length);
        // clear markers from the map
        for (var i = 0; i < myMapApp.markers.length; i++) {
            myMapApp.markers[i].setMap(null);
        }
        // remove the markers from the array
        myMapApp.markers = [];
    };

    // set a single map marker
    myMapApp.setMapMarker = function ( category, name, lat, lon) {

        var marker = new google.maps.Marker({

            position: new google.maps.LatLng(lat, lon),
            title: name,
            map: myMapApp.map,
            draggable: false
        });

        myMapApp.markers.push(marker);

        // draging for the markers
        google.maps.event.addListener(marker, 'drag', function() {
            var pos = marker.getPosition();
            this.lat(pos.lat());
            this.lon(pos.lng());
        }.bind(this));

        google.maps.event.addListener(marker, 'dragend', function() {
            var pos = marker.getPosition();
            this.lat(pos.lat());
            this.lon(pos.lng());
        }.bind(this));

    };

    // set array item for each map location
    myMapApp.setArray = function ( category, name, lat, lon) {
        this.category = ko.observable(category);
        this.name = ko.observable(name);
        this.lat = ko.observable(lat);
        this.lon = ko.observable(lon);
    };

    // load the map
    myMapApp.loadMap = function(item){
        // initialize the complete list
        myMapApp.CompleteList = ko.observableArray();
        // create the complete list of map locations
        for (var j = 0; j < item.length; j++){
            myMapApp.CompleteList.push( new myMapApp.setArray( item[j]['category'], item[j]['name'], item[j]['lat'], item[j]['lon']));
        }
        // create the filtered list
        myMapApp.FilteredList = ko.computed(function() {
          var filter = myMapApp.query().toLowerCase();
          if(myMapApp.query() === "") {
              // return the complete list
              return myMapApp.CompleteList();
          } else {
              return ko.utils.arrayFilter(myMapApp.CompleteList(), function(item) {
                //console.log(item.name());
                //return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
                return item.name().toLowerCase().indexOf(filter)>-1;
              });
          }
        });
        // mapMarkerList should be filtered list if there is one, otherwise the complete list.
        var mapMarkerList = ko.observableArray();
        mapMarkerList = myMapApp.CompleteList;
        if (myMapApp.FilteredList().length > 0) {
                mapMarkerList = myMapApp.FilteredList;
        };
        // delete the current markers on the map
        myMapApp.deleteMarkers();
        // create new markers based on the mapMarkerList
        for (var j = 0; j < mapMarkerList().length; j++){
            var n = mapMarkerList()[j].name();
            myMapApp.setMapMarker( mapMarkerList()[j].category(), mapMarkerList()[j].name(), mapMarkerList()[j].lat(), mapMarkerList()[j].lon());
        }
    };

// ------- Model -------

    myMapApp.model = function () {
        console.log("self = ", self);
        var data = {
            geoCoordinates : [
                {'category':'Historical', 'name': "Dome of the Rock", 'lat':31.778021, 'lon':35.235392},
                {'category':'Religious',  'name':  "Al-Aqsa Mosque",'lat':31.776173, 'lon':35.235928},
                {'category':'Historical', 'name': "City of David", 'lat':31.774307, 'lon':35.236110},
                {'category':'Historical', 'name': "Tower of David", 'lat':31.776358, 'lon':35.228404},
                {'category':'Religious',  'name': "Church of the Holy Sepulchre", 'lat':31.778503, 'lon':35.229762}
            ],
            centerCoordinates : [31.776347, 35.231446],
            zoomLevel : 16
        }
        this.model.geoCoordinates = data.geoCoordinates;
        this.model.centerCoordinates = data.centerCoordinates;
        this.model.zoomLevel = data.zoomLevel;
    };

// ------- View Model -------

    myMapApp.viewModel = function() {
        myMapApp.model();
        myMapApp.view();
    };

// ------- View -------

    myMapApp.view = function (){
        myMapApp.createMap();
        myMapApp.loadMap( myMapApp.model.geoCoordinates );
    };

    // Apply Knockout bindings to the View Model.
    ko.applyBindings(myMapApp.viewModel);
});