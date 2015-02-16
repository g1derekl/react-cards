/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'public/build.js',
        dest: 'public/build.min.js'
      }
    },
    less: {
      compile: {
        options: {
          cleancss: true
        },
        files: {
          'public/main.min.css': 'lib/css/main.less'
        }
      }
    },
    browserify: {
      options: {
        transform: [require('grunt-react').browserify]
      },
      app: {
        src: 'lib/react/index.jsx',
        dest: 'public/build.js'
      }
    },
    watch: {
      react: {
        files: ['lib/flux/**/*', 'lib/js/**/*', 'lib/react/**/*'],
        tasks: ['browserify']
      },
      css: {
        files: 'lib/css/**/*',
        tasks: ['less']
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-react');

  // Default task.
  grunt.registerTask('default', ['browserify', 'less', 'uglify']);

};
