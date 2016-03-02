// myMapApp namespace to keep separate from outside js libraries.
var myMapApp = myMapApp || { };

//
myMapApp.viewModel = function() {
    // initialize some variables
    console.log("viewModel");
    var Jerusalem = new google.maps.LatLng(31.776347, 35.231446);
    var service;
    var infowindow;
    var lat;
    var lng;
    myMapApp.markers = [];
    myMapApp.marker = null;
    myMapApp.bounds = null;
    myMapApp.query = ko.observable("");
    //myMapApp.chosenPlaceTypes = ko.observableArray();
    myMapApp.CompleteList = ko.observableArray();
    myMapApp.FilteredList = ko.observableArray();
    myMapApp.flickrPhotos = [];
    myMapApp.noGooglePages = 0;
    // new data structure in array with these fields: placeIcon, googlePlaceType, displayPlaceType.
    myMapApp.googleTypes = ['church', 'mosque', 'museum', 'place_of_worship', 'synagogue', 'park'];
    myMapApp.placeTypes = ko.observableArray();
    //myMapApp.placeTypes = [];
    // myMapApp.placeTypes =
    //   [{displayPlaceType: "Church", placeIcon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},
    //    {displayPlaceType: "Mosque", placeIcon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"},
    //    {displayPlaceType: "Museum", placeIcon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"},
    //    {displayPlaceType: "Place of Worship", placeIcon: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png"},
    //    {displayPlaceType: "Synagogue", placeIcon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"}
    //   ];

    myMapApp.placeTypes.push({displayPlaceType: "Church", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Mosque", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Museum", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Place of Worship", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Synagogue", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"});
    myMapApp.placeTypes.push({displayPlaceType: "Park", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"});

    // myMapApp.placeTypes.push({displayPlaceType: "Cafe", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/blue-pushpin.png"});
    // myMapApp.placeTypes.push({displayPlaceType: "Food", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/grn-pushpin.png"});
    // myMapApp.placeTypes.push({displayPlaceType: "Cemetary", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
    // myMapApp.placeTypes.push({displayPlaceType: "Establishment", checkedPlace: ko.observable(true), placeIcon: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png"});


    myMapApp.init = function() {

      console.log("init");
      myMapApp.createMap();
      myMapApp.subscribePlaceTypes();
      myMapApp.getPlacesFromGoogleMaps();
      myMapApp.getMapCenter();

      // move FilteredList code

    };

    // create a knockout subscribe to changes to the array element myMapApp.placeTypes.checkedPlace

    myMapApp.subscribePlaceTypes = function () {
      var arr = myMapApp.placeTypes();
      for(var i=0, cnt=arr.length;i<cnt;i++){
        var item = arr[i].checkedPlace;
        item.subscribe(myMapApp.checkedPlaceChange);
      }
    }

    // a change has occurred to the checkedPlace field in the legend
    myMapApp.checkedPlaceChange = function(NewValue){
      alert('An items name property change to '+NewValue);
      // create a computed list for each place type
      // loop over the place types
      // save each computed list in an array (push)
      // or, just push to FilterList as go along
    }

    myMapApp.getPlacesFromGoogleMaps = function () {

      var request = {
          location: Jerusalem,
          radius: 3219,
          types: myMapApp.googleTypes
          //types: ['church', 'mosque', 'museum', 'place_of_worship', 'synagogue', 'point_of_interest']
      };

      infowindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService(myMapApp.map);
      service.nearbySearch(request, processGoogleResults);

      // Look up location by textSearch.
      // var request = {
      //     location: Jerusalem,
      //     radius: 3219,
      //     query: "Mount of Olives"
      //     //name: 'Western Wall'
      // };

      // infowindow = new google.maps.InfoWindow();
      // service = new google.maps.places.PlacesService(myMapApp.map);
      // service.textSearch(request, processGoogleResults);
    };

    function processGoogleResults (results, status, pagination) {
      ///console.log("processGoogleResults, results length = ", results.length);
      console.log("processGoogleResults, results = ", results);
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        myMapApp.bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          place.marker = myMapApp.setMapMarker(place);
          myMapApp.bounds.extend(new google.maps.LatLng(
            place.geometry.location.lat(),
            place.geometry.location.lng()));
        }
        myMapApp.map.fitBounds(myMapApp.bounds);
        // this creates the CompleteList
        results.forEach(myMapApp.getAllMapData);
        myMapApp.noGooglePages++;
        // process multiple pages
        if (myMapApp.noGooglePages < 3) {
            //console.log("pagination has next page", pagination);
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
              console.log("more button event listener");
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

    // NOT USED ANYMORE

    myMapApp.getFilteredList = function(){
      // create the filtered list
      myMapApp.ComputedList = ko.computed(function() {
        var filter = myMapApp.query().toLowerCase();
        if (myMapApp.query() === "") {
            console.log("No filter", filter);
            // return the complete list
            return myMapApp.CompleteList();
        } else {
            return ko.utils.arrayFilter(myMapApp.CompleteList(), function(item) {
              //find the filter string in the name
              return item.name().toLowerCase().indexOf(filter)>-1;
            });
        }
      });
      myMapApp.FilteredList = myMapApp.ComputedList;
      //console.log("myMapApp.CompleteList= ", myMapApp.CompleteList());
      //console.log("myMapApp.FilteredList= ", myMapApp.FilteredList());
    };


    // create the Complete List of map data
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
      // if (place.vicinity !== undefined) {
      //   address = place.vicinity;
      // } else if (place.formatted_address !== undefined) {
      //   address = place.formatted_address;
      // }
      myMapLocation.address = ko.observable(address);
      //console.log("myMapLocation = ", myMapLocation);
      myMapApp.CompleteList.push(myMapLocation);
      myMapApp.FilteredList.push(myMapLocation);
      // Add flickr data to data structure
      //console.log("place", place);
      var lat = place.geometry.location.lat();
      var lon = place.geometry.location.lng();
      var placeName = place.name;
      var placeID = place.place_id;
      //console.log("lat = ", lat);
      //console.log("marker = ", marker);

      myMapApp.getFlickrPhotos(lat, lon, placeName, placeID);
    };


    // Filter

    myMapApp.query.subscribe (function(newValue) {
      //console.log("Search new value = ", newValue);
      //console.log("B4 myMapApp.FilteredList= ", myMapApp.FilteredList());

      myMapApp.ComputedList = ko.computed(function() {
        var filter = myMapApp.query().toLowerCase();
        if (myMapApp.query() === "") {
            //console.log("No filter", filter);
            // return the complete list
            return myMapApp.CompleteList();
        } else {
            return ko.utils.arrayFilter(myMapApp.CompleteList(), function(item) {
              //find the filter string in the name
              return item.name().toLowerCase().indexOf(filter)>-1;
            });
        }
      });
      //console.log("myMapApp.CompleteList= ", myMapApp.CompleteList());
      //console.log("myMapApp.FilteredList= ", myMapApp.FilteredList());
      //console.log("myMapApp.ComputedList= ", myMapApp.ComputedList());

      // Correct the list with the filtered places
      myMapApp.FilteredList.removeAll();
      for (var i = 0; i < myMapApp.ComputedList().length; i++) {
        myMapApp.FilteredList.push( myMapApp.ComputedList()[i] );
      }
      // Correct the markers with the filtered locations
      myMapApp.deleteMarkers();
      for (var i = 0; i < myMapApp.FilteredList().length; i++) {
        myMapApp.setMapMarker(myMapApp.FilteredList()[i].place);
      }

      //myMapApp.FilteredList().removeAll;
      //console.log("Empty myMapApp.FilteredList= ", myMapApp.FilteredList());
    });

    myMapApp.getMapCenter = function() {
      var latLng = myMapApp.map.getCenter();
      lat = latLng.lat();
      lng = latLng.lng();
    };

    // create the Google map
    myMapApp.createMap = function(){
        // set map options
        var myOptions = {
            zoom: 16,
            center: Jerusalem,
            mapTypeId: google.maps.MapTypeId.TERRAIN
            // HYBRID
            // ROADMAP
            // SATELLITE
            // TERRAIN
            // dynamic setting: map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
            //mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // create the Google map
        myMapApp.map = new google.maps.Map( $('#map')[0], myOptions);

        // resize event
        google.maps.event.addDomListener(window, 'resize', function() {
          // re-fit the markers to the screen as the screen size changes
          // keep markers centered on map
          myMapApp.map.fitBounds(myMapApp.bounds);
          //alert("resize of map");
        });
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

    // Click on list item.

    myMapApp.clickList = function(place) {
      var marker;
      //console.log("myMapApp.markers = ", myMapApp.markers);
      //console.log("place = ", place);
      //console.log("place_id = ",place.place_id());
      for(var i = 0; i < myMapApp.markers.length; i++) {
        //console.log(myMapApp.markers[i].place_id);
        if(place.place_id() === myMapApp.markers[i].place_id) {
          marker = myMapApp.markers[i];
          break;
        }
      }
      //self.getFoursquareInfo(place);
      //console.log("marker = ", marker);
      myMapApp.map.panTo(marker.position);

      // waits 300 milliseconds for the getFoursquare async function to finish
      //setTimeout(function() {
        // var contentString = place.name();
        // infowindow.setContent(contentString);
        // infowindow.open(myMapApp.map, marker);
        // marker.setAnimation(google.maps.Animation.DROP);
        var placeName = place.name();
        var placeAddress = place.address();
        var placeType = place.types[0];
        //var placePhotos = place.flickrPhotos;
        //console.log("clickList place = ", place);
        myMapApp.displayInfoWindow(placeName, placeAddress, placeType, marker);

      //}, 300);
    };





    // create the Google Maps inforwindow.

    myMapApp.displayInfoWindow = function (placeName, placeAddress, placeType, marker) {

      var photoURL = "";
      var photoImages = [];
      //console.log("marker = ", marker);

      for (var i = 0; i < myMapApp.flickrPhotos.length; i++) {
        //console.log(myMapApp.markers[i].place_id);
        if(marker.place_id === myMapApp.flickrPhotos[i].place_id) {
          console.log("Found photo");
          photoURL = myMapApp.flickrPhotos[i].imagesArray[0];
          break;
        }
      }
      console.log("photoURL.length = ", photoURL.length, photoURL);
      if (photoURL.length == 0) {
        //photoURL = "<div>No Flickr photos found for " + placeName + ".</div>";
        photoURL = "No Flickr photos found for " + placeName + ".";
      }

      //photoImages = myMapApp.flickrPhotos[marker.place_id];
      //console.log("myMapApp.flickrPhotos = ", myMapApp.flickrPhotos);
      //console.log("photoImages = ",photoImages);

      // if (typeof photoImages != 'undefined') {
      //   if (photoImages.length > 0) {
      //     photoURL = photoImages[0];
      //   }
      // }


      //var infoContent = placeName;
      // var infoContent = "<a>" + placeName + "</a>" + '<br>' + placeAddress
      //   + '<br>' + placeType + '<br>' + "<img width='80' src=" +
      //   photoURL + ">" ;

      // replace _ in type with a blank
      var placeTypeString = placeType.replace(/_/g,' ');
      // set marker to global variable for use in displayWikiArticles
      myMapApp.marker = marker;

      var infoContent = "<a>" + placeName + "</a>" + '<br>' + placeAddress
        + '<br>' + placeTypeString + '<br>' + photoURL + '<br>' +
        '<button id="wiki" onclick="myMapApp.displayWikiArticles()">Wiki Articles</button>';


      //console.log("infocontent = ", infoContent);


      myMapApp.infoContent = infoContent;


      infowindow.setContent(infoContent);
      //console.log("infowindow.open");
      infowindow.open(myMapApp.map, marker);

      //console.log("panto");
      myMapApp.map.panTo(marker.position);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){marker.setAnimation(null);}, 1450);
      //console.log("Completed displayInfoWindow");
    }

     myMapApp.displayWikiArticles = function () {
      // get Wiki articles and return array of articles to display in inforwindow.
      // get Wiki articles

      // loop over wikiContent and make a list element

      // get Wiki articles and return array of articles to display in inforwindow.
      var wikiArticles = [];

      // var wikiRequestTimeout = setTimeout(function(){
      //   alert("Failed to get Wikipedia Resources");
      // }, 8000);

      var searchString = myMapApp.marker.title;
      console.log("wiki search srtring = ", searchString);
      var wikiURL =   'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + searchString +
                    '&format=json&callback=wikiCallback';
      $.ajax({
          url: wikiURL,
          dataType: 'jsonp',
          success: function(response) {
              console.log("wiki success");
              var articleList = response[1];
              for (var i = 0; i < articleList.length; i++) {
                  var articleStr = articleList[i];
                  var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                  //console.log('****<li><a href="' + url + '">' + articleStr + '</a></li>');
                  // If the user selects a wiki article, open it in a new browser window (target param).
                  // This leaves the map app screen unchanged when the user returns.
                  wikiArticles.push('<li><a href="' + url + '" target="_blank">' + articleStr + '</a></li>');
              };
              //var infowindow2 = new google.maps.InfoWindow();
              console.log("no of wiki articles = ", articleList.length);
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
              infowindow.setContent(myMapApp.infoContent + wikiContent);
              // once the wiki articles have been displayed, disable the button
              var wikiButton = document.getElementById('wiki');
              wikiButton.disabled = true;
              //infowindow2.setContent(wikiContent);
              //infowindow2.open(myMapApp.map, myMapApp.marker);
              //console.log(response);
              clearTimeout(wikiRequestTimeout);
          },
          error: function (request, status, error) {
            alert("Unable to access wiki resources at this time.  Error message = ", request.responseText);
            console.log("Error with wiki ajax request, error = ", request.responseText);
          }
      });
    }



    myMapApp.getFlickrPhotos = function (searchLat, searchLon, placeName, placeID) {

      //console.log("getFlickrPhotos searchLat, searchLon, placeName, placeID = ", searchLat, searchLon, placeName, placeID)

      var flickrPhotosArray = [];
      // var FLICKR_API_KEY = '0ac0ce40df15543f032c315fafeb8dfe';
      // var searchUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&";
      // var searchReqParams = {
      //   'api_key': FLICKR_API_KEY,
      //   'tags': 'monument,statue,historical,church,mosque,synagogue,museum',
      //   'has_geo': true,
      //   'lat': searchLat,
      //   'lon': searchLon,
      //   //'place_id': place.place_id,
      //   'accuracy': 16,
      //   'format': 'json',
      //   'safe_search': 1,
      //   'privacy_filter': 1,
      //   'per_page': 10,
      //   'text': placeName
      // }

      // $.ajax({
      //   type: 'GET',
      //   url : searchUrl,
      //   dataType:'jsonp',
      //   cache : true,
      //   crossDomain : true,
      //   jsonp: false,
      //   jsonpCallback : 'jsonFlickrApi',
      //   data: searchReqParams,
      //   success: function(data, textStatus) {
      //     console.log("** AJAX SUCCESS **");
      //     if (data.photos.photo.length > 0) {
      //       flickrPhotosArray = getImages(data);
      //       storeImages(flickrPhotosArray);
      //       //$('#warning').hide();
      //     } else {
      //       console.log(data.photos);
      //       //$('#warning').show();
      //     }
      //   }
      // })
      // .fail(function(jqXHR, textStatus, errorThrown) {
      //   console.log('req failed');
      //   console.log('textStatus: ', textStatus, ' code: ', jqXHR.status);
      // });

      // function jsonFlickrApi(result) {
      //     console.log("jsonFlickrApi");
      // };

      // new logic to call flickr

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


      function getImages(data) {
        //console.log("getImages", data);
        var htmlPhotoURLs = [];
        $.each(data.photos.photo, function(i,item){
              //Reads in each photo id.
              //var photoID = item.id;
              //Adds the photo id to the 'images1' div (created in the main body of this html page).
              //$('#images').append(photoID);
              //Gets the url for the image.
              var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
              //Uses this URL to creats a html 'img' tag.
              htmlString = '<img src="' + photoURL + '">';
              //Adds this image to the 'images1' div.
              //$('#images').append(htmlString);
              //Adds some basic formatting to seperate out the images.
              //$('#images').append("<br/><hr/><br/>");
              htmlPhotoURLs.push(htmlString);
              //console.log("htmlString", htmlString);
          });
        return htmlPhotoURLs;
      };

      function storeImages(imagesArray) {
        // CompleteList
        // for(var i = 0; i < myMapApp.CompleteList.length; i++) {
        //   //console.log(myMapApp.markers[i].place_id);
        //   if(placeID === myMapApp.CompleteList[i].place_id) {
        //     console.log("Found location in storeImages");
        //     myMapApp.CompleteList[i].flickrImages = imagesArray;
        //     break;
        //   }
        // }
        // // FilteredList
        // for(var i = 0; i < myMapApp.FilteredList.length; i++) {
        //   //console.log(myMapApp.markers[i].place_id);
        //   if(placeID === myMapApp.FilteredList[i].place_id) {
        //     myMapApp.FilteredList[i].flickrImages = imagesArray;
        //     break;
        //   }
        // }
        //console.log("placeID = ", placeID)

        var imagesRecord = {};
        imagesRecord.place_id = placeID;
        imagesRecord.imagesArray = imagesArray;
        myMapApp.flickrPhotos.push(imagesRecord);

      };

    };



    // set a single map marker
    myMapApp.setMapMarker = function (place) {
        //console.log("setMapMarker");
       //myMapApp.placeTypes = ['church', 'mosque', 'museum', 'place_of_worship', 'synagogue', 'point_of_interest'];
        // var placeIcons = ['http://maps.google.com/mapfiles/ms/icons/blue-dot.png',    // church
        //                   'http://maps.google.com/mapfiles/ms/icons/green-dot.png',   // mosque
        //                   'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',  // museaum
        //                   'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',  // place of worship
        //                   'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',  // synagogue
        //                   'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'];   // point of interest

        var placeType = place.types[0];
        //console.log("myMapApp.placeTypes = ", myMapApp.placeTypes);
        for (var i = 0; i < myMapApp.googleTypes.length; i++) {
          if (placeType == myMapApp.googleTypes[i]) {
            var placeIconFile = myMapApp.placeTypes()[i].placeIcon;
            break;
          }
        }
        //console.log("placeIconFile = ", placeIconFile);
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

        myMapApp.markers.push(marker);

        // var photoURL = " ";
        // //var infoContent = place.name;
        // var infoContent = "<a>" + place.name + "</a>" + '<br>' + place.address
        //   + '<br>' + place.types[1] + '<br>' + "<img width='80' src=" +
        //   photoURL + ">" ;

        // click on a Google Maps marker

        google.maps.event.addListener(marker, 'click', function() {
          //console.log("click Marker place = ", place);

          // var address;
          // if (place.vicinity !== undefined) {
          //   address = place.vicinity;
          // } else if (place.formatted_address !== undefined) {
          //   address = place.formatted_address;
          // }

          var placeName = place.name;
          var placeAddress = myMapApp.setAddress(place);
          var placeType = place.types[0];
          //var placePhotos = place.flickrPhotos;
          myMapApp.displayInfoWindow(placeName, placeAddress, placeType, marker);
          // console.log("click marker");
          // infowindow.setContent(infoContent);
          // infowindow.open(myMapApp.map, this);
          // myMapApp.map.panTo(marker.position);
          // marker.setAnimation(google.maps.Animation.BOUNCE);
          // setTimeout(function(){marker.setAnimation(null);}, 1450);
        });
        // draging for the markers
        //
        //mouse over event for this point's marker
        // google.maps.event.addListener(marker, 'mouseover', function() {
        //     self.mouseHere(this);
        // }.bind(this));

        //mouse out event for  this point's marker
        // google.maps.event.addListener(marker, 'mouseout', function() {
        //     self.mouseGone(this);
        // }.bind(this));

        return marker;
    };

    // set array item for each map location
    myMapApp.setAddress = function (place) {
        var address;
          if (place.vicinity !== undefined) {
            address = place.vicinity;
          } else if (place.formatted_address !== undefined) {
            address = place.formatted_address;
          }
          return address;
    };

    // set array item for each map location
    // myMapApp.setArray = function ( category, name, lat, lon) {
    //     this.category = ko.observable(category);
    //     this.name = ko.observable(name);
    //     this.lat = ko.observable(lat);
    //     this.lon = ko.observable(lon);
    // };

    // load the map
    // myMapApp.loadMap = function(item){
    //     console.log("LoadMap start");
    //     // initialize the complete list
    //     //myMapApp.CompleteList = ko.observableArray();
    //     // create the complete list of map locations
    //     for (var j = 0; j < item.length; j++){
    //         myMapApp.CompleteList.push( new myMapApp.setArray( item[j]['category'], item[j]['name'], item[j]['lat'], item[j]['lon']));
    //     }
    //     console.log("item.length = ", item.length);

    //     // create the filtered list
    //     myMapApp.FilteredList = ko.computed(function() {
    //       var filter = myMapApp.query().toLowerCase();
    //       if(myMapApp.query() === "") {
    //           // return the complete list
    //           console.log("CompleteList =", myMapApp.CompleteList());
    //           return myMapApp.CompleteList();
    //       } else {
    //           return ko.utils.arrayFilter(myMapApp.CompleteList(), function(item) {
    //             //find the filter string in the name
    //             return item.name().toLowerCase().indexOf(filter)>-1;
    //           });
    //       }
    //     });

    //     // mapMarkerList should be filtered list if there is one, otherwise the complete list.
    //     var mapMarkerList = ko.observableArray();
    //     mapMarkerList = myMapApp.CompleteList;
    //     if (myMapApp.FilteredList().length > 0) {
    //             mapMarkerList = myMapApp.FilteredList;
    //     };
    //     console.log("FilteredList =", myMapApp.FilteredList());
    //     console.log("mapMarkerList =", mapMarkerList());
    //     // delete the current markers on the map
    //     myMapApp.deleteMarkers();
    //     // create new markers based on the mapMarkerList
    //     for (var j = 0; j < mapMarkerList().length; j++){
    //         var n = mapMarkerList()[j].name();
    //         myMapApp.setMapMarker( mapMarkerList()[j].category(), mapMarkerList()[j].name(), mapMarkerList()[j].lat(), mapMarkerList()[j].lon());
    //     }
    // };

    // get all the map locations from Google Maps
    // myMapApp.getDataFromGoogleMaps = function(data) {
    //      // must create the map to use Google Maps Place Services to locate places.
    //      console.log("Enter getDataFromGoogleMaps");

    //      function initialize() {

    //          myMapApp.createMap();

    //          var pyrmont = new google.maps.LatLng(myMapApp.model.centerCoordinates[0], myMapApp.model.centerCoordinates[1]);

    //          // Specify location, radius and place types for your Places API search.
    //          // note: radius is in meters,  3219 meters = 2 miles
    //           var request = {
    //             location: pyrmont,
    //             radius: '3219',
    //             types: ['church', 'mosque', 'museum', 'place_of_worship', 'synagogue', 'point_of_interest']
    //           };

    //           // Create the PlaceService and send the request.
    //           // Handle the callback with an anonymous function.
    //           var service = new google.maps.places.PlacesService(myMapApp.map);
    //           console.log("B4 call to nearbySearch");
    //           // this service request is asynchronous
    //           service.nearbySearch(request, callback);
    //       }

    //       function callback (results, status) {
    //         if (status == google.maps.places.PlacesServiceStatus.OK) {
    //           console.log("B4: callback, CompleteList: ", myMapApp.CompleteList());
    //           console.log("B4: callback, myMapApp.model.geoCoordinates: ", myMapApp.model.geoCoordinates);
    //           for (var i = 0; i < results.length; i++) {
    //             var place = results[i];
    //             // If the request succeeds, draw the place location on
    //             // the map as a marker, and register an event to handle a
    //             // click on the marker.
    //             // var marker = new google.maps.Marker({
    //             //   map: map,
    //             //   position: place.geometry.location
    //             // });
    //             //console.log("place = ", place);
    //             if (i == 0) {
    //                 data.geoCoordinates = [];
    //                 myMapApp.CompleteList([]);
    //                 myMapApp.model.geoCoordinates = [];
    //             }
    //             var category = place.types[0];
    //             var name = place.name;
    //             var lat = place.geometry.location.lat();
    //             var lon = place.geometry.location.lng();
    //             //console.log(category, name, lat, lon);
    //             data.geoCoordinates.push({'category':category, 'name': name, 'lat': lat, 'lon': lon});
    //             myMapApp.CompleteList.push( new myMapApp.setArray(category, name, lat, lon));
    //             //myMapApp.model.geoCoordinates.push(category, name, lat, lon);
    //             myMapApp.model.geoCoordinates.push({'category':category, 'name': name, 'lat': lat, 'lon': lon});
    //           }
    //           console.log("Inside getDataFromGoogleMaps, data.geoCoordinates: ", data.geoCoordinates);
    //           //myMapApp.FilteredList = data.geoCoordinates;
    //           console.log("Complete List: ", myMapApp.CompleteList);
    //           console.log("myMapApp.model.geoCoordinates: ", myMapApp.model.geoCoordinates);
    //           myMapApp.loadMap( myMapApp.model.geoCoordinates );
    //           //myMapApp.view();
    //           //ko.applyBindings(myMapApp.viewModel);
    //           //myMapApp.model.geoCoordinates = data.geoCoordinates;
    //           //console.log("After: myMapApp.model.geoCoordinates: ", myMapApp.model.geoCoordinates);
    //         } else {
    //             console.error(status);
    //             return;
    //         }
    //       }
    //       initialize();
    //       console.log("B4 return: data.geoCoordinates", data.geoCoordinates);
    //       return;
    // };

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

    // myMapApp.viewModel = function() {
    //     myMapApp.model();
    //     myMapApp.view();
    // };

// ------- View -------

    // myMapApp.view = function (){
    //     myMapApp.createMap();
    //     console.log("B4 loadmap: ", myMapApp.model.geoCoordinates);
    //     myMapApp.loadMap( myMapApp.model.geoCoordinates );
    // };

    // Apply Knockout bindings to the View Model.
    //ko.applyBindings(myMapApp.viewModel);
    //console.log("After ko.applyBindings: data.geoCoordinates", myMapApp.model.geoCoordinates);
    google.maps.event.addDomListener(window, 'load', myMapApp.init);
};


$(function(){
  console.log("apply bindings");
  ko.applyBindings(new myMapApp.viewModel());
});