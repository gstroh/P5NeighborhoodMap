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
        console.log("LoadMap start");
        // initialize the complete list
        myMapApp.CompleteList = ko.observableArray();
        // create the complete list of map locations
        for (var j = 0; j < item.length; j++){
            myMapApp.CompleteList.push( new myMapApp.setArray( item[j]['category'], item[j]['name'], item[j]['lat'], item[j]['lon']));
        }
        console.log("item.length = ", item.length);

        // create the filtered list
        myMapApp.FilteredList = ko.computed(function() {
          var filter = myMapApp.query().toLowerCase();
          console.log("*** myMapApp.FilteredList ko.computed");
          if(myMapApp.query() === "") {
              // return the complete list
              console.log("CompleteList =", myMapApp.CompleteList());
              return myMapApp.CompleteList();
          } else {
              return ko.utils.arrayFilter(myMapApp.CompleteList(), function(item) {
                //find the filter string in the name
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
        console.log("FilteredList =", myMapApp.FilteredList());
        console.log("mapMarkerList =", mapMarkerList());
        // delete the current markers on the map
        myMapApp.deleteMarkers();
        // create new markers based on the mapMarkerList
        for (var j = 0; j < mapMarkerList().length; j++){
            var n = mapMarkerList()[j].name();
            myMapApp.setMapMarker( mapMarkerList()[j].category(), mapMarkerList()[j].name(), mapMarkerList()[j].lat(), mapMarkerList()[j].lon());
        }
    };

    // get all the map locations from Google Maps
    myMapApp.getDataFromGoogleMaps = function(data) {
         // must create the map to use Google Maps Place Services to locate places.
         console.log("Enter getDataFromGoogleMaps");

         function initialize() {

             myMapApp.createMap();

             var pyrmont = new google.maps.LatLng(myMapApp.model.centerCoordinates[0], myMapApp.model.centerCoordinates[1]);

             // Specify location, radius and place types for your Places API search.
             // note: radius is in meters,  3219 meters = 2 miles
              var request = {
                location: pyrmont,
                radius: '3219',
                types: ['church', 'mosque', 'museum', 'place_of_worship', 'synagogue', 'point_of_interest']
              };

              // Create the PlaceService and send the request.
              // Handle the callback with an anonymous function.
              var service = new google.maps.places.PlacesService(myMapApp.map);
              console.log("B4 call to nearbySearch");
              // this service request is asynchronous
              service.nearbySearch(request, callback);
          }

          function callback (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log("B4: callback, CompleteList: ", myMapApp.CompleteList());
              console.log("B4: callback, myMapApp.model.geoCoordinates: ", myMapApp.model.geoCoordinates);
              for (var i = 0; i < results.length; i++) {
                var place = results[i];
                // If the request succeeds, draw the place location on
                // the map as a marker, and register an event to handle a
                // click on the marker.
                // var marker = new google.maps.Marker({
                //   map: map,
                //   position: place.geometry.location
                // });
                //console.log("place = ", place);
                if (i == 0) {
                    data.geoCoordinates = [];
                    myMapApp.CompleteList([]);
                    myMapApp.model.geoCoordinates = [];
                }
                var category = place.types[0];
                var name = place.name;
                var lat = place.geometry.location.lat();
                var lon = place.geometry.location.lng();
                //console.log(category, name, lat, lon);
                data.geoCoordinates.push({'category':category, 'name': name, 'lat': lat, 'lon': lon});
                myMapApp.CompleteList.push( new myMapApp.setArray(category, name, lat, lon));
                //myMapApp.model.geoCoordinates.push(category, name, lat, lon);
                myMapApp.model.geoCoordinates.push({'category':category, 'name': name, 'lat': lat, 'lon': lon});
              }
              console.log("Inside getDataFromGoogleMaps, data.geoCoordinates: ", data.geoCoordinates);
              //myMapApp.FilteredList = data.geoCoordinates;
              console.log("Complete List: ", myMapApp.CompleteList);
              console.log("myMapApp.model.geoCoordinates: ", myMapApp.model.geoCoordinates);
              myMapApp.loadMap( myMapApp.model.geoCoordinates );
              //myMapApp.view();
              //ko.applyBindings(myMapApp.viewModel);
              //myMapApp.model.geoCoordinates = data.geoCoordinates;
              //console.log("After: myMapApp.model.geoCoordinates: ", myMapApp.model.geoCoordinates);
            } else {
                console.error(status);
                return;
            }
          }
          initialize();
          console.log("B4 return: data.geoCoordinates", data.geoCoordinates);
          return;
    };

// ------- Model -------

    myMapApp.model = function () {
        var self = this;
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
        };

        //self.model.geoCoordinates = ko.observableArray();

        setData = function (data) {
            self.model.geoCoordinates = data.geoCoordinates;
            self.model.centerCoordinates = data.centerCoordinates;
            self.model.zoomLevel = data.zoomLevel;
        };

        setData(data);
        console.log("After setdata(1) data.geoCoordinates", data.geoCoordinates);

        //myMapApp.getDataFromGoogleMaps(data);
        //console.log("After getDataFromGoogleMaps: myMapApp.geoCoordinates", myMapApp.model.geoCoordinates);

        //setData(data);
        //console.log("After setdata(2) data.geoCoordinates", data.geoCoordinates);
    };

    // myMapApp.CompleteList.subscribe(function(newValue) {
    //     alert("CompleteList has changed! " + newValue);
    // });

// ------- View Model -------

    myMapApp.viewModel = function() {
        myMapApp.model();
        myMapApp.view();
    };

// ------- View -------

    myMapApp.view = function (){
        myMapApp.createMap();
        console.log("B4 loadmap: ", myMapApp.model.geoCoordinates);
        myMapApp.loadMap( myMapApp.model.geoCoordinates );
    };

    // Apply Knockout bindings to the View Model.
    ko.applyBindings(myMapApp.viewModel);
    console.log("After ko.applyBindings: data.geoCoordinates", myMapApp.model.geoCoordinates);
});