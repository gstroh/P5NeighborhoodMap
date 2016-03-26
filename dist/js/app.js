var myMapApp=myMapApp||{};myMapApp.viewModel=function(){myMapApp.Jerusalem=new google.maps.LatLng(31.776347,35.231446),myMapApp.infowindow=null,myMapApp.markers=[],myMapApp.marker=null,myMapApp.bounds=null,myMapApp.query=ko.observable(""),myMapApp.CompleteList=ko.observableArray(),myMapApp.FilteredList=ko.observableArray(),myMapApp.flickrPhotos=[],myMapApp.noGooglePages=0,myMapApp.googleTypes=[],myMapApp.placeTypes=ko.observableArray(),myMapApp.placeTypes.push({displayPlaceType:"Church",googleType:"church",checkedPlace:ko.observable(!0),placeIcon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}),myMapApp.placeTypes.push({displayPlaceType:"Mosque",googleType:"mosque",checkedPlace:ko.observable(!0),placeIcon:"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}),myMapApp.placeTypes.push({displayPlaceType:"Museum",googleType:"museum",checkedPlace:ko.observable(!0),placeIcon:"http://maps.google.com/mapfiles/ms/icons/orange-dot.png"}),myMapApp.placeTypes.push({displayPlaceType:"Place of Worship",googleType:"place_of_worship",checkedPlace:ko.observable(!0),placeIcon:"http://maps.google.com/mapfiles/ms/icons/pink-dot.png"}),myMapApp.placeTypes.push({displayPlaceType:"Synagogue",googleType:"synagogue",checkedPlace:ko.observable(!0),placeIcon:"http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"}),myMapApp.placeTypes.push({displayPlaceType:"Park",googleType:"park",checkedPlace:ko.observable(!0),placeIcon:"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}),myMapApp.init=function(){myMapApp.createMap(),myMapApp.subscribePlaceTypes(),myMapApp.getGooglePlaceTypes(),myMapApp.getPlacesFromGoogleMaps()},myMapApp.createMap=function(){var a={zoom:16,center:myMapApp.Jerusalem,mapTypeId:google.maps.MapTypeId.TERRAIN};myMapApp.map=new google.maps.Map($("#map")[0],a),google.maps.event.addDomListener(window,"resize",function(){myMapApp.centerMap()})},myMapApp.subscribePlaceTypes=function(){for(var a=myMapApp.placeTypes(),b=0,c=a.length;c>b;b++){var d=a[b].checkedPlace;d.subscribe(myMapApp.checkedPlaceChange)}},myMapApp.checkedPlaceChange=function(a){for(var b=ko.observableArray(),c=0;c<myMapApp.CompleteList().length;c++)for(var d=0;d<myMapApp.placeTypes().length;d++)1==myMapApp.placeTypes()[d].checkedPlace()&&myMapApp.CompleteList()[c].types[0]==myMapApp.googleTypes[d]&&b.push(myMapApp.CompleteList()[c]);myMapApp.displayFilteredList(b)},myMapApp.setCheckedPlaceTrue=function(){for(var a=0;a<myMapApp.placeTypes().length;a++)0==myMapApp.placeTypes()[a].checkedPlace()&&myMapApp.placeTypes()[a].checkedPlace(!0)},myMapApp.setCheckedPlaceDisabled=function(a){var b=document.getElementsByClassName("legendCheckBox");console.log("legend = ",b);for(var c=0;c<b.length;c++)b[c].disabled=a},myMapApp.displayFilteredList=function(a){myMapApp.FilteredList.removeAll();for(var b=0;b<a().length;b++)myMapApp.FilteredList.push(a()[b]);myMapApp.deleteMarkers(),myMapApp.bounds=new google.maps.LatLngBounds;for(var b=0;b<myMapApp.FilteredList().length;b++){var c=myMapApp.FilteredList()[b].place;c.marker=myMapApp.setMapMarker(myMapApp.FilteredList()[b].place),myMapApp.bounds.extend(new google.maps.LatLng(c.geometry.location.lat(),c.geometry.location.lng()))}myMapApp.centerMap()},myMapApp.getGooglePlaceTypes=function(){myMapApp.googleTypes=[];for(var a=0;a<myMapApp.placeTypes().length;a++)1==myMapApp.placeTypes()[a].checkedPlace()&&myMapApp.googleTypes.push(myMapApp.placeTypes()[a].googleType)},myMapApp.getPlacesFromGoogleMaps=function(){var a={location:myMapApp.Jerusalem,radius:3219,types:myMapApp.googleTypes};myMapApp.infowindow=new google.maps.InfoWindow;var b=new google.maps.places.PlacesService(myMapApp.map);b.nearbySearch(a,processGoogleResults)},processGoogleResults=function(a,b,c){if(b!=google.maps.places.PlacesServiceStatus.OK)return console.error(b),void alert("Unable to access Google Maps.  Status message = "+b);myMapApp.bounds=new google.maps.LatLngBounds;for(var d=a.length-1;d>=0;d--){var e=a[d],f=e.name,g=myMapApp.setAddress(e);myMapApp.isHebrew(f)?a.splice(d,1):myMapApp.isHebrew(g)?a.splice(d,1):e.marker=myMapApp.setMapMarker(e)}for(var d=0;d<myMapApp.markers.length;d++)myMapApp.bounds.extend(myMapApp.markers[d].position);if(myMapApp.centerMap(),a.forEach(myMapApp.getAllMapData),myMapApp.noGooglePages++,1==myMapApp.noGooglePages&&c.nextPage(),myMapApp.noGooglePages<3){var h=document.getElementById("more");h.disabled=!1,h.addEventListener("click",function(){h.disabled=!0,myMapApp.setCheckedPlaceTrue(),c.nextPage()})}},myMapApp.isHebrew=function(a){var b=!1;return a.charCodeAt(0)>1424&&a.charCodeAt(0)<1535&&(b=!0),b},myMapApp.setMapMarker=function(a){for(var b=a.types[0],c=0;c<myMapApp.placeTypes().length;c++)if(b==myMapApp.placeTypes()[c].googleType){var d=myMapApp.placeTypes()[c].placeIcon;break}var e=new google.maps.Marker({map:myMapApp.map,icon:d,position:a.geometry.location,title:a.name,place_id:a.place_id,animation:google.maps.Animation.DROP,draggable:!1,types:a.types});return myMapApp.markers.push(e),google.maps.event.addListener(e,"click",function(){var b=a.name,c=myMapApp.setAddress(a),d=a.types[0];myMapApp.displayInfoWindow(b,c,d,e)}),e},myMapApp.getAllMapData=function(a){var b={};b.place_id=ko.observable(a.place_id),b.position=ko.observable(a.geometry.location.toString()),b.name=ko.observable(a.name),b.place=a,b.types=a.types;var c;c=myMapApp.setAddress(a),b.address=ko.observable(c),myMapApp.CompleteList.push(b),myMapApp.FilteredList.push(b);var d=a.geometry.location.lat(),e=a.geometry.location.lng(),f=a.name,g=a.place_id;myMapApp.getFlickrPhotos(d,e,f,g)},myMapApp.getFlickrPhotos=function(a,b,c,d){function e(a){var b=[];return $.each(a.photos.photo,function(a,c){var d="http://farm"+c.farm+".static.flickr.com/"+c.server+"/"+c.id+"_"+c.secret+"_m.jpg";htmlString='<img src="'+d+'">',b.push(htmlString)}),b}function f(a){var b={};b.place_id=d,b.imagesArray=a,myMapApp.flickrPhotos.push(b)}var g=[],h=c.replace(" ","+"),i="https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=0ac0ce40df15543f032c315fafeb8dfe&text="+h+"&license=1%2C2%2C3%2C4%2C5%2C6%2C7&content_type=1&lat="+a+"&lon="+b+"&radius=1&radius_units=km&per_page=10&page=1&format=json&nojsoncallback=1";$.getJSON(i).done(function(a){a.photos.photo.length>0&&(g=e(a),f(g))}).fail(function(a,b,c){alert("Unable to get photos from Flickr at this time."),console.log("Failed to getFlickrPhotos, error = ",c)})},myMapApp.query.subscribe(function(a){a.length>0?(myMapApp.setCheckedPlaceTrue(),myMapApp.setCheckedPlaceDisabled(!0)):myMapApp.setCheckedPlaceDisabled(!1),myMapApp.ComputedList=ko.computed(function(){var a=myMapApp.query().toLowerCase();return""===myMapApp.query()?myMapApp.CompleteList():ko.utils.arrayFilter(myMapApp.CompleteList(),function(b){return b.name().toLowerCase().indexOf(a)>-1})}),myMapApp.displayFilteredList(myMapApp.ComputedList)}),myMapApp.centerMap=function(){myMapApp.map.fitBounds(myMapApp.bounds);var a=$(window).width();a>400&&myMapApp.map.panBy(-100,0),google.maps.event.trigger(myMapApp.map,"resize")},myMapApp.deleteMarkers=function(){for(var a=0;a<myMapApp.markers.length;a++)myMapApp.markers[a].setMap(null);myMapApp.markers=[]},myMapApp.clickList=function(a){for(var b,c=0;c<myMapApp.markers.length;c++)if(a.place_id()===myMapApp.markers[c].place_id){b=myMapApp.markers[c];break}var d=a.name(),e=a.address(),f=a.types[0];myMapApp.displayInfoWindow(d,e,f,b)},myMapApp.displayInfoWindow=function(a,b,c,d){for(var e="",f=0;f<myMapApp.flickrPhotos.length;f++)if(d.place_id===myMapApp.flickrPhotos[f].place_id){e=myMapApp.flickrPhotos[f].imagesArray[0];break}0==e.length&&(e="No Flickr photos found for "+a+".");for(var f=0;f<myMapApp.placeTypes().length;f++)if(c==myMapApp.placeTypes()[f].googleType){var g=myMapApp.placeTypes()[f].displayPlaceType;break}myMapApp.marker=d;var h="<a>"+a+"</a><br>"+b+"<br>"+g+"<br>"+e+'<br><button id="wiki" onclick="myMapApp.displayWikiArticles()">Wiki Articles</button>';myMapApp.infoContent=h,myMapApp.infowindow.setContent(h),myMapApp.infowindow.open(myMapApp.map,d),myMapApp.map.panTo(d.position);var i=$(window).width();500>=i&&myMapApp.map.panBy(-100,-150),d.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){d.setAnimation(null)},1450)},myMapApp.displayWikiArticles=function(){var a=[],b=myMapApp.marker.title,c="http://en.wikipedia.org/w/api.php?action=opensearch&search="+b+"&format=json&callback=wikiCallback";$.ajax({url:c,dataType:"jsonp",success:function(c){for(var d=c[1],e=0;e<d.length;e++){var f=d[e],g="http://en.wikipedia.org/wiki/"+f;a.push('<li><a href="'+g+'" target="_blank">'+f+"</a></li>")}var h="";if(d.length>0)for(var e=0;e<a.length;e++){var i=a[e];h+=i}else h="<div>No Wiki articles found for "+b+".</div>";myMapApp.infowindow.setContent(myMapApp.infoContent+h);var j=document.getElementById("wiki");j.disabled=!0},error:function(a,b,c){alert("Unable to access wiki resources at this time.  Error message = ",a.responseText),console.log("Error with wiki ajax request, error = ",a.responseText)}})},myMapApp.setAddress=function(a){var b;return void 0!==a.vicinity?b=a.vicinity:void 0!==a.formatted_address&&(b=a.formatted_address),b},google.maps.event.addDomListener(window,"load",myMapApp.init)},$(function(){ko.applyBindings(new myMapApp.viewModel)});