## Neighborhood Map Project

The purpose of this project is to create an application to display a neighborhood map using the Google Maps API by applying the techniques I've picked up in the [Intro to AJAX course](https://www.udacity.com/course/ud110) and in the [Javascript Design Patterns course](https://www.udacity.com/course/ud989).   I additionaly use the Flickr API for images and the Wikipedia API for articles about the locations on my map.  Knockout was utilized to implement the Model-View-View-Model (MVVM) pattern of JavaScript code design.

To get started, check out the repository to inspect the code and check out the deployed application on gh-pages:

* [Github code repository](https://github.com/gstroh/P5NeighborhoodMap)
* [Deployed application on gh-pages](http://gstroh.github.io/P5NeighborhoodMap/)
* To start the application locally, run this file: dist/index.html

### The Jerusalem Map

#### Map Navigation

The map is centered in the old city of Jerusalem.  It collects locations from the Google Maps API within a 2 mile radius that have an English name (note: locations with Hebrew-only names are eliminated).  Locations are color coded and displayed in a legend at the bottom of the screen:

![(Legend)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/src/images/legend.png?raw=true "Legend")

There is a checkbox next to each location type in the legend.  Use this checkbox to eliminate or add back this type of location to the map.  On small devices the legend does not appear.

On the left of the screen is a list of map locations.

![(Scroll Bar)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/src/images/scrollBar.png?raw=true "Scroll Bar")

You may select a location by using the scroll bar or by selecting the marker on the map.  When selecting a location, the following information window will appear:

![(Info Window Wiki)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/src/images/infowindowWiki.png?raw=true "Info Window Wiki")

The information window displays the following information:

* The name of the location
* The address of the location
* The Google Map location type
* A Flickr photo of the location if available
* Wiki Articles (if available) about the location

Select the desired Wiki article and it will appear in a separate browser tab.

To search locations by name, use the search bar at the top of the scroll bar:

![(Search)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/src/images/search.png?raw=true "Search")

As search criteria are typed into the search bar, the locations on the map will reflect this search criteria.

When the map is initially displayed, it retrieves two groups of locations from Google Maps.  An additional group of locations can be retrieved my selecting the More Results button:

![(More Results)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/src/images/moreResults.png?raw=true "More Results")

When the maximum results have been displayed, this button will be greyed out and can no longer be selected.


#### Map Navigation on Small Devices

On small devices, such as phones, the map will display as follows:

![(Small Map)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/src/images/smallMap.png?raw=true "Small Map")

The More Results button is now at the top of the scroll bar on the left of the screen.  The locations scroll bar is not displayed to save room.  To display the locations, selected the hamburger icon on the upper right of the screen:

![(Small Map Scroll Bar)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/src/images/smallMapScrollBar.png?raw=true "Small Map Scroll Bar")

Selecting the hamburger icon again will make the locations scroll bar to be removed.


### Project file structure

Per instructions for this project, the following directories were used for source and production code and files: src and dist, respectively.  I also have a dev directory which I used for intermediary files from grunt-uncss.  The gh-pages application uses the dist directory for running the application.

### Grunt packages needed to run grunt for this application.

The following grunt plugins were used to automatically perform optimizations, minification, pushing changes to Github, remove unused CSS, copy files and create images of multiple sizes and quality.

* grunt
* grunt-contrib-imagemin
* grunt-contrib-cssmin
* grunt-contrib-htmlmin
* grunt-contrib-uglify
* grunt-uncss
* grunt-gh-pages
* grunt-contrib-copy

Gruntfile.js and package.json are included in the project's base directory.

### Procedure used to deploy application.

The following commands were used in the terminal application (Mac) in the application base directory:

1. grunt
1. git commit -a
1. git push origin master
1. grunt gh-pages

Explanation of commands:

1. Use grunt to automate copying files and minification of html, css and js.
1. Commit the current changes to git.
1. Push the changes to Github.
1. Use grunt-gh-pages to deploy the application to gh-pages.
