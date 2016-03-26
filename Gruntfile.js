module.exports = function(grunt) {

  grunt.initConfig({


    imagemin: {
      dynamic: {
        files: [{
         expand: true,                        // Enable dynamic expansion
         cwd: 'src/images/',                  // Src matches are relative to this path
         src: ['**/*.{png,jpg,gif}'],         // Actual patterns to match
         dest: 'dist/images/'                 // Destination path prefix
        }]
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.css'
        }]
      }
    },

    htmlmin: {                                     // Task
      dist: {                                      // Target
       options: {                                  // Target options
        removeComments: true,
        collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/index.html': 'src/index.html'      // 'destination': 'source'

        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'dist/js/app.js': ['src/js/app.js'],
          'dist/js/jQuery/jquery-2.1.3.min.js': ['src/js/jQuery/jquery-2.1.3.min.js'],
          'dist/js/knockout/knockout-3.4.0.js': ['src/js/knockout/knockout-3.4.0.js']
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    },

    copy: {
      main: {
        files: [
          {src: ['src/README.md'], dest: 'dist/README.md', filter: 'isFile'},
          {src: ['src/images/menu.svg'], dest: 'dist/images/menu.svg', filter: 'isFile'}
        ],
      },
    },

     uncss: {
      dist: {
        files: [
          {dest: 'dev/css/style.css', src: 'src/index.html'}
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['imagemin','cssmin','htmlmin','uglify','copy']);

};
