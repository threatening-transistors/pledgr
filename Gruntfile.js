module.exports = function(grunt) {
  var jsFiles = [
    'index.js',
    'Gruntfile.js',
    'client/app/**/*.js',
    'server/**/*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: 'config/.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    jscs: {
      src: jsFiles,
      options: {
        config: 'config/.jscsrc'
      }
    },
   explainjs: {
      dynamic_mappings: {
          files : [
          {
            expand: true,
            cwd: './',
            src: jsFiles,
            dest: 'documentation/',
            ext: '.html',
            extDot: 'first'
          }
          ]
        },
      dist: {
        options: {
          showFilename: true // default is false
        }
      }
    }

  });
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-explainjs');

  grunt.registerTask('buildDocs', ['explainjs']); 

  grunt.registerTask('default', ['jshint', 'jscs']);
};
