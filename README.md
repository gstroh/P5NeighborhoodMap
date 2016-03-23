## Neighborhood Map Project

The purpose of this project is to create an application to display a neighborhood map using the Google Maps API by applying the techniques I've picked up in the [Intro to AJAX course](https://www.udacity.com/course/ud110) and in the [Javascript Design Patterns course](https://www.udacity.com/course/ud989).  I additionaly use the Flickr API for images and the Wikipedia API for articles about the locations on my map.

To get started, check out the repository to inspect the code and check out the deployed application on gh-pages:

* [Github code repository](https://github.com/gstroh/P5NeighborhoodMap)
* [Deployed application on gh-pages](http://gstroh.github.io/P5NeighborhoodMap/)

### The Jerusalem Map

#### Map Navigation

The map is centered in the old city of Jerusalem.  It collects locations from the Google Maps API within a 2 mile radius that have an English name (note: locations with Hebrew-only names are eliminated).  Locations are color coded and displayed in a legend at the bottom of the screen: ![(Legend)](https://github.com/gstroh/P5NeighborhoodMap/blob/master/images/legend.png?raw=true "Legend")

1. Used async in JS where applicable to prevent blocking in all html.
1. Added media="print" on print.css declaration to prevent CRP blocking.
1. Resize and optimize the huge pizzeria.jpg file.
1. Used a media query for pizzeria.jpg and scrset to allow browser to choose image size based on viewport width and display quality (1x/2x).
1. Optimize all images.
1. Inline style.css in index.html.
1. Inline font through JS code after footer in index.html.
1. Did not inline perfmatter.js due to use of async.
1. Combine pizza.html stylesheets style.css and bootstrap-grid.css.  Used grunt-uncss to remove unused css in both files.  Inlined combined CSS file.
1. Changed project-2048.html to reference local copy of img/2048.png.  Also, optimized it.
1. Minified all css with grunt-contrib-cssmin.
1. Minified all html with grunt-contrib-htmlmin.
1. Minified all js with grunt-uglify.
1. Compressed all images with grunt-contrib-imagemin.
1. Created smaller images of pizzeria.jpg with grunt-resonsive-images.

#### Part 2: Optimize Frames per Second in pizza.html

Following is a list of changes I made to ensure the frame rate while scrolling in pizza.html is 60fps or better:

1. Complete rewrite of function changePizzaSizes in main.js.  Eliminate unnecessary code and code causing render blocking.
1. Changed function updatePositions in main.js to move scrollTop out of the loop.  It caused Layout.
1. Replaced querySelectorAll with getElementsByClassName.  More performant.
1. Used requestAnimationFrame for animation of pizzas on screen.  Put call to requestAnimationFrame inside new function renderPositions.
1. Replaced use of CSS basicLeft property with transform translateX property in function updatePositions in main.js.
1. Add will-change: transform to mover class in style.css inlined in pizza.html.

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
