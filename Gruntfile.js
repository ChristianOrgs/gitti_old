module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("./package.json"),
    uglify: { 
        options: { 
            compress: true,
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        }, 
        application: { 
            src: [ 
                './assets/lazysizes.js',
                './assets/handlebars.min.js',
                './assets/valencia.js'
            ], 
            dest: './assets/application.min.js.liquid' 
        },
        bundled: {
            src: ['./assets/modernizr.min.js', './assets/respond.min.js'],
            dest: './assets/bundle.min.js'
        }
    } 
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Default task(s).
  grunt.registerTask("default", ["uglify"]);
};
