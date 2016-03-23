// myMapApp namespace to keep separate from outside js libraries.
var myMapApp = myMapApp || { };

// ------- View Model -------

myMapApp.viewModel = function() {
    // initialize some variables
    //console.log("viewModel");
    myMapApp.Jerusalem = new google.maps.LatLng(31.776347, 35.231446);
    myMapApp.infowindow = null;
    myMapApp.markers = [];
    myMapApp.marker = null;
    myMapApp.bounds = null;
    myMapApp.query = ko.observable("");
    myMapApp.CompleteList = ko.observableArray();
    myMapApp.FilteredList = ko.observableArray();
    myMapApp.flickrPhotos = [];
    myMapApp.noGooglePages = 0;

    // ------- Model -------

    // The model is defined here with an array of Google place types used in getPlacesFromGoogleMaps
    myMapApp.googleTypes = [];
    // The folowing knockout array is also used to define place types, checked boxes and icons used in the application
    myMapApp.placeTypes = ko.observableArray();
    // add plave types to ko.observable array
    myMapApp.placeTypes.push({displayPlaceType: "Church", googleType: "church", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Mosque", googleType: "mosque", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Museum", googleType: "museum", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Place of Worship", googleType: "place_of_worship", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Synagogue", googleType: "synagogue", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Park", googleType: "park", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"});

// The init function includes the model, view model and view.  The model is generated using Google
// Maps API.  Locations are gathered based on a 2 mile radius from a center point in Jerusalem and the
// place types I selected.  But, Google Maps is also a major part of the view.  Knockout handles much
// of the view model with observables.  Therefore, in the application it is impossible to clearly split
// out the model, view model and view.


    // initialize the View Model
    myMapApp.init = function() {
      myMapApp.createMap();
      myMapApp.subscribePlaceTypes();
      myMapApp.getGooglePlaceTypes();
      myMapApp.getPlacesFromGoogleMaps();
    };


    // create the Google map
    myMapApp.createMap = function(){
        // set map options
        var myOptions = {
            zoom: 16,
            center: myMapApp.Jerusalem,
            // Google map type IDs: HYBRID, ROADMAP, SATELLITE, TERRAIN
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        // create the Google map
        myMapApp.map = new google.maps.Map( $('#map')[0], myOptions);
        // resize event
        google.maps.event.addDomListener(window, 'resize', function() {
          // re-fit the markers to the screen as the screen size changes
          // keep markers centered on map
          myMapApp.centerMap();
        });
    };


    // Create a knockout subscribe to changes to the array element myMapApp.placeTypes.checkedPlace.
    // These buttons appear in the legend at the bottom of the screen.
    myMapApp.subscribePlaceTypes = function () {
      var arr = myMapApp.placeTypes();
      for(var i=0, cnt=arr.length;i<cnt;i++){
        var item = arr[i].checkedPlace;
        item.subscribe(myMapApp.checkedPlaceChange);
      }
    }


    // a change has occurred to the checkedPlace field in the legend
    myMapApp.checkedPlaceChange = function(NewValue){
      console.log("checkedPlaceChange", NewValue);
      // set search query to null string
      //var sq = ko.observable("query");
      // if (myMapApp.query() != "") {
      //   console.log("query = ", myMapApp.query());
      //   myMapApp.query("");
      // }
      // myMapApp.deleteMarkers();
      // myMapApp.FilteredList.removeAll();
      // myMapApp.CompleteList.removeAll();
      // myMapApp.getGooglePlaceTypes();
      // myMapApp.getPlacesFromGoogleMaps();

      // myMapApp.query("");
      // //alert('An items name property change to '+NewValue);
      // create a copy of FilteredList with types checked in legend
      var NewFilteredList = ko.observableArray();
      for (var i = 0; i < myMapApp.CompleteList().length; i++) {
          // console.log("FilteredList = ", myMapApp.FilteredList());
          // console.log("googleTypes = ", myMapApp.googleTypes);
          // console.log("place types = ", myMapApp.placeTypes());
          for (var j = 0; j < myMapApp.placeTypes().length; j++) {
            // console.log("myMapApp.placeTypes()[j].checkedPlace = ", myMapApp.placeTypes()[j].checkedPlace());
            // console.log("myMapApp.FilteredList()[i].types[0] = ", myMapApp.FilteredList()[i].types[0]);
            // console.log("myMapApp.googleTypes[j] = ", myMapApp.googleTypes[j]);
            if (myMapApp.placeTypes()[j].checkedPlace()  == true &&
                myMapApp.CompleteList()[i].types[0] == myMapApp.googleTypes[j]) {
              // console.log("** PUSH **");
              NewFilteredList.push( myMapApp.CompleteList()[i] );
            }
          }
      }
      console.log("display New FilteredList");
      myMapApp.displayFilteredList(NewFilteredList);
    };


    // set the checked place field in the legend to true
    myMapApp.setCheckedPlaceTrue = function () {
      console.log("set CheckedPlaceTrue");
      for (var i = 0; i < myMapApp.placeTypes().length; i++) {
        if (myMapApp.placeTypes()[i].checkedPlace() == false) {
          myMapApp.placeTypes()[i].checkedPlace(true);
        }
      }
    }


    // set the checked place field in the legend to logical input (true/false)
    myMapApp.setCheckedPlaceDisabled = function (logical) {
      console.log("set CheckedPlaceDisabled");

      var legend = document.getElementsByClassName("legendCheckBox");
      console.log("legend = ", legend);
      for (var i = 0; i < legend.length; i++) {
        legend[i].disabled = logical;
      }
    }


    // display the Filtered List
    myMapApp.displayFilteredList = function (NewList) {
      // remove existing Filtered List
      myMapApp.FilteredList.removeAll();
      // replace Filtered List with new list
      for (var i = 0; i < NewList().length; i++) {
        myMapApp.FilteredList.push( NewList()[i] );
      }
      // Set the markers with the filtered locations
      myMapApp.deleteMarkers();
      myMapApp.bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < myMapApp.FilteredList().length; i++) {
        var place = myMapApp.FilteredList()[i].place;
        place.marker = myMapApp.setMapMarker(myMapApp.FilteredList()[i].place);
        myMapApp.bounds.extend(new google.maps.LatLng(
            place.geometry.location.lat(),
            place.geometry.location.lng()));
      }
      // center the map
      myMapApp.centerMap();
      console.log("finished displayFiltered List");
    }


    // set the myMapApp.googleTypes array based on the options chosen by the user in the legend
    myMapApp.getGooglePlaceTypes = function () {
      myMapApp.googleTypes = [];
      for (var i = 0; i < myMapApp.placeTypes().length; i++) {
        if (myMapApp.placeTypes()[i].checkedPlace()  == true ) {
          myMapApp.googleTypes.push(myMapApp.placeTypes()[i].googleType);
        }
      }
      //console.log("myMapApp.googleTypes = ", myMapApp.googleTypes);
    };

    // Get map locations from Google maps by doing a nearbySearch of Jerusalem for a radius of 2 miles.
    // This call is asynchronous, using callback processGoogleResults.
    myMapApp.getPlacesFromGoogleMaps = function () {
      // set request params
      var request = {
          location: myMapApp.Jerusalem,
          radius: 3219,
          types: myMapApp.googleTypes
      };
      myMapApp.infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(myMapApp.map);
      // use nearbySearch to get Google map locations
      service.nearbySearch(request, processGoogleResults);
      // Look up location by textSearch.
      // var request = {
      //     location: Jerusalem,
      //     radius: 3219,
      //     query: "Mount of Olives"
      //     //name: 'Western Wall'
      // };
      // service = new google.maps.places.PlacesService(myMapApp.map);
      // service.textSearch(request, processGoogleResults);
    };


    // callback function from nearbySearch of Google maps
    processGoogleResults = function (results, status, pagination) {
      // check the status and process error below
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        myMapApp.bounds = new google.maps.LatLngBounds();
        // loop through the array in reverse order to
        for (var i = results.length - 1; i >= 0; i--) {
          var place = results[i];
          var placeName = place.name;
          //console.log("placeName = ", placeName);
          var placeAddress = myMapApp.setAddress(place);
          // Test to see if Hebrew place name and remove it.
          if (myMapApp.isHebrew(placeName)) {
            //console.log("Hebrew place name = ", placeName);
            results.splice(i,1);
            continue;
          }
          // Test to see if Hebrew place address and remove it.
          if (myMapApp.isHebrew(placeAddress)) {
            //console.log("Hebrew place address = ", placeAddress);
            results.splice(i,1);
            continue;
          }
          // set map marker
          place.marker = myMapApp.setMapMarker(place);
        }

        // Loop over all markers to set bounds.
        for (var i = 0; i < myMapApp.markers.length; i++) {
            myMapApp.bounds.extend(myMapApp.markers[i].position);
        }
        // center the map
        myMapApp.centerMap();
        // this creates the CompleteList
        results.forEach(myMapApp.getAllMapData);
        // increment the number of Google results pages that have been processed
        myMapApp.noGooglePages++;
        // process the second page
        if (myMapApp.noGooglePages == 1) {
          pagination.nextPage();
        }
        // pagination.nextPage();
        // myMapApp.noGooglePages++;
        // process multiple pages
        if (myMapApp.noGooglePages < 3) {
            //console.log("pagination has next page", pagination);
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
              console.log("more button event listener");
              // Change the searchMap ID to inline to allow scrolling
              // var searchMap = document.getElementById("searchMap");
              // console.log("searchMap = ", searchMap);
              // searchMap.style.display = "inline";

              moreButton.disabled = true;
              // if (pagination.hasNextPage) {
              //   console.log("** pagination has next page", pagination);
              pagination.nextPage();
              // } else {
              //   moreButton.disabled = true;
              // }

            });
        }
        // if (pagination.hasNextPage) {
        //   console.log("pagination has next page", pagination);
        //   //console.log("pagination");
        //   pagination.nextPage();
        // }
      } else {
          // error connecting to Google Maps
          console.error(status);
          alert("Unable to access Google Maps.  Status message = " + status);
          return;
      }
      //console.log("myMapApp.markers = ", myMapApp.markers);
    };


    // is the text string Hebrew?
    myMapApp.isHebrew = function (text) {
      var rvalue = false;
      if (text.charCodeAt(0) > 0x590 && text.charCodeAt(0) < 0x5FF) {
            rvalue = true;
      }
      return rvalue;
    };


    // set a single map marker
    myMapApp.setMapMarker = function (place) {
        var placeType = place.types[0];
        //console.log("placeType = ", placeType);
        // find the place icon file address located in the googleTypes array
        for (var i = 0; i < myMapApp.placeTypes().length; i++) {
          //console.log("placeType = ", placeType);
          //console.log("myMapApp.placeTypes()[i].googleType = ", myMapApp.placeTypes()[i].googleType);
          if (placeType == myMapApp.placeTypes()[i].googleType) {
            var placeIconFile = myMapApp.placeTypes()[i].placeIcon;
            break;
          }
        }
        // create the marker properties
        var marker = new google.maps.Marker({
            map: myMapApp.map,
            icon: placeIconFile,
            position: place.geometry.location,
            title: place.name,
            place_id: place.place_id,
            animation: google.maps.Animation.DROP,
            draggable: false,
            types: place.types
        });
        // put the marker in the markers array
        myMapApp.markers.push(marker);
        // event listener for a click event on a Google Maps marker
        google.maps.event.addListener(marker, 'click', function() {
          var placeName = place.name;
          var placeAddress = myMapApp.setAddress(place);
          var placeType = place.types[0];
          // display an inforwindow for the location
          myMapApp.displayInfoWindow(placeName, placeAddress, placeType, marker);
        });
        return marker;
    };


    // create the Complete & Filtered Lists of map data
    myMapApp.getAllMapData = function(place) {
      // Google place input param
      //console.log("getAllMapData", place);
      var myMapLocation = {};
      myMapLocation.place_id = ko.observable(place.place_id);
      myMapLocation.position = ko.observable(place.geometry.location.toString());
      myMapLocation.name = ko.observable(place.name);
      myMapLocation.place = place;
      myMapLocation.types = place.types;

      var address;
      address = myMapApp.setAddress(place);
      myMapLocation.address = ko.observable(address);
      // add data to Complete and Filtered Lists
      myMapApp.CompleteList.push(myMapLocation);
      myMapApp.FilteredList.push(myMapLocation);

      // Add flickr data to data structure
      var lat = place.geometry.location.lat();
      var lon = place.geometry.location.lng();
      var placeName = place.name;
      var placeID = place.place_id;
      // request Flickr data for location
      myMapApp.getFlickrPhotos(lat, lon, placeName, placeID);
    };


    // get Flickr photos for a given location
    myMapApp.getFlickrPhotos = function (searchLat, searchLon, placeName, placeID) {
      // initialize variables
      var flickrPhotosArray = [];
      var searchString = placeName.replace(' ','+');
      var searchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search' +
        '&api_key=0ac0ce40df15543f032c315fafeb8dfe&text=' + searchString +
        '&license=1%2C2%2C3%2C4%2C5%2C6%2C7&content_type=1&lat=' + searchLat +
        '&lon=' + searchLon + '&radius=1&radius_units=km&per_page=10&page=1' +
        '&format=json&nojsoncallback=1';
      // Get flickr data with async call.
      // If successful, parse the data and store in an array to display.
      // If fails, notify user.
      $.getJSON(searchUrl)
        .done(function(data) {
          //console.log("** AJAX SUCCESS **");
          if (data.photos.photo.length > 0) {
            flickrPhotosArray = getImages(data);
            storeImages(flickrPhotosArray);
          }
        })
        .fail(function(jqxhr, textStatus, error) {
          alert("Unable to get photos from Flickr at this time.");
          console.log("Failed to getFlickrPhotos, error = ", error);
        });


      // get Flickr image html URL
      function getImages(data) {
        var htmlPhotoURLs = [];
        $.each(data.photos.photo, function(i,item){
              //Gets the url for the image.
              var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
              //Uses this URL to creats a html 'img' tag.
              htmlString = '<img src="' + photoURL + '">';
              // add the URL to the htmlPhotoURLs array
              htmlPhotoURLs.push(htmlString);
          });
        return htmlPhotoURLs;
      };


      // store images in flickrPhotos array
      function storeImages(imagesArray) {
        var imagesRecord = {};
        imagesRecord.place_id = placeID;
        imagesRecord.imagesArray = imagesArray;
        myMapApp.flickrPhotos.push(imagesRecord);
      };

    };


    // Filter the search query field
    myMapApp.query.subscribe (function(newValue) {
      console.log("query.subscribe, newValue = ", newValue);
      if (newValue.length > 0) {
        myMapApp.setCheckedPlaceTrue();
        myMapApp.setCheckedPlaceDisabled(true);
      } else {
        myMapApp.setCheckedPlaceDisabled(false);
      }

      // set all place types in legend to TRUE if non-blank search query
      // if (myMapApp.query() != "") {
      //       myMapApp.setCheckedPlaceTrue();
      // }
      // use knockout to filter the Complete List and create the Computed List
      myMapApp.ComputedList = ko.computed(function() {
        console.log("Inside query.subscribe ComputedList def");
        var filter = myMapApp.query().toLowerCase();
        if (myMapApp.query() === "") {
            //console.log("No filter", filter);
            // return the complete list
            return myMapApp.CompleteList();
        } else {
            //myMapApp.setCheckedPlaceTrue();
            //myMapApp.setCheckedPlaceDisabled();
            return ko.utils.arrayFilter(myMapApp.CompleteList(), function(item) {
              //find the filter string in the name
              return item.name().toLowerCase().indexOf(filter)>-1;
            });
        }
      });
      // display the Filtered List
      myMapApp.displayFilteredList(myMapApp.ComputedList);
    });


    // center the map based on the current myMapApp.bounds value
    myMapApp.centerMap = function () {
      myMapApp.map.fitBounds(myMapApp.bounds);
      var width = $(window).width();
      // pan the map center if the locations list is showing
      if (width > 400) {
        console.log("panBy(-100,0)");
        myMapApp.map.panBy(-100,0);
      }
      google.maps.event.trigger(myMapApp.map, "resize");
    }


    // Delete the markers from the map.
    myMapApp.deleteMarkers = function () {
        // clear markers from the map
        for (var i = 0; i < myMapApp.markers.length; i++) {
            myMapApp.markers[i].setMap(null);
        }
        // remove the markers from the array
        myMapApp.markers = [];
    };


    // Click on list item.
    myMapApp.clickList = function(place) {
      var marker;
      // find the marker associated with the list item
      for(var i = 0; i < myMapApp.markers.length; i++) {
        if(place.place_id() === myMapApp.markers[i].place_id) {
          marker = myMapApp.markers[i];
          break;
        }
      }
      // display the infowindow for the list item
      var placeName = place.name();
      var placeAddress = place.address();
      var placeType = place.types[0];
      myMapApp.displayInfoWindow(placeName, placeAddress, placeType, marker);
    };


    // create the Google Maps inforwindow.
    myMapApp.displayInfoWindow = function (placeName, placeAddress, placeType, marker) {
      var photoURL = "";
      var photoImages = [];
      // see if there is a flick photo for this location
      for (var i = 0; i < myMapApp.flickrPhotos.length; i++) {
        if(marker.place_id === myMapApp.flickrPhotos[i].place_id) {
          photoURL = myMapApp.flickrPhotos[i].imagesArray[0];
          break;
        }
      }
      // if no photo found, tell the user
      if (photoURL.length == 0) {
        //photoURL = "<div>No Flickr photos found for " + placeName + ".</div>";
        photoURL = "No Flickr photos found for " + placeName + ".";
      }
      // find the display place type
      for (var i = 0; i < myMapApp.placeTypes().length; i++) {
          if (placeType == myMapApp.placeTypes()[i].googleType) {
            var placeTypeString = myMapApp.placeTypes()[i].displayPlaceType;
            break;
          }
      }
      // set marker to global variable for use in displayWikiArticles
      myMapApp.marker = marker;
      // display the infowindow
      var infoContent = "<a>" + placeName + "</a>" + '<br>' + placeAddress
        + '<br>' + placeTypeString + '<br>' + photoURL + '<br>' +
        '<button id="wiki" onclick="myMapApp.displayWikiArticles()">Wiki Articles</button>';
      myMapApp.infoContent = infoContent;
      myMapApp.infowindow.setContent(infoContent);
      myMapApp.infowindow.open(myMapApp.map, marker);
      // pan to the marker selected
      console.log("marker.position = ", marker.position.lat());
      myMapApp.map.panTo(marker.position);
      // adjust the position to allow the inforWindow to fit in smaller screens
      var width = $(window).width();
      if (width <= 500) {
        console.log("panBy(-100,-125)");
        myMapApp.map.panBy(-100,-150);
      }
      // set the marker animation
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){marker.setAnimation(null);}, 1450);
    };


    // display any wiki articles on the given location
    myMapApp.displayWikiArticles = function () {
      var wikiArticles = [];
      var searchString = myMapApp.marker.title;
      var wikiURL =   'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + searchString +
                    '&format=json&callback=wikiCallback';
      // ajax request to wiki
      $.ajax({
          url: wikiURL,
          dataType: 'jsonp',
          success: function(response) {
              var articleList = response[1];
              // gather an array of wiki articles in html, if any
              for (var i = 0; i < articleList.length; i++) {
                  var articleStr = articleList[i];
                  var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                  // If the user selects a wiki article, open it in a new browser window (target param).
                  // This leaves the map app screen unchanged when the user returns.
                  wikiArticles.push('<li><a href="' + url + '" target="_blank">' + articleStr + '</a></li>');
              };
              //console.log("no of wiki articles = ", articleList.length);
              // put the wiki content to display in the inforwindow into a single string for display
              var wikiContent = "";
              if (articleList.length > 0) {
                for (var i = 0; i < wikiArticles.length; i++) {
                  var wikiHTML = wikiArticles[i];
                  wikiContent = wikiContent + wikiHTML;
                };
              } else {
                wikiContent = "<div>No Wiki articles found for " + searchString + ".</div>";
              }
              // display the wiki articles below the current content
              myMapApp.infowindow.setContent(myMapApp.infoContent + wikiContent);
              // once the wiki articles have been displayed, disable the button
              var wikiButton = document.getElementById('wiki');
              wikiButton.disabled = true;
          },
          // process any error with the wiki ajax request
          error: function (request, status, error) {
            alert("Unable to access wiki resources at this time.  Error message = ", request.responseText);
            console.log("Error with wiki ajax request, error = ", request.responseText);
          }
      });
    };


    // set address for each map location
    myMapApp.setAddress = function (place) {
        var address;
          if (place.vicinity !== undefined) {
            address = place.vicinity;
          } else if (place.formatted_address !== undefined) {
            address = place.formatted_address;
          }
          return address;
    };

    // initialize the map when the window is loaded
    google.maps.event.addDomListener(window, 'load', myMapApp.init);

};

// apply knockout bindings to the view model
$(function(){
  ko.applyBindings(new myMapApp.viewModel());
});

