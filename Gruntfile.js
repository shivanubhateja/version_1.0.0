module.exports = function(grunt) {

grunt.initConfig({
	shell : { 

	kill : {
			command : 'fuser -k 3000/tcp'
		},
		reload : {
	        	command : 'node server/app.js'
      		}
    	},
	watch : {
	       files: 'server/app.js',
	       tasks: ['shell:reload'] 
		},
	});

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};
