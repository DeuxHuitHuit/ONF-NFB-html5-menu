/*global module:false*/
module.exports = function(grunt) {

	"use strict";
	
	// Modules
	grunt.loadNpmTasks('grunt-contrib-less');
	
	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', 'src/<%= pkg.name %>.js', 'src/jquery.cookie.js'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		qunit: {
			files: []
		},
		lint: {
			files: ['grunt.js', 'src/<%= pkg.name %>.js']
		},
		/*watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		},*/
		jshint: {
			options: {
				curly: true,
				eqeqeq: false, // allow ==
				immed: false, //
				latedef: false, // late definition
				newcap: false, // capitalize ctos
				nonew: true, // no new ..()
				noarg: true, 
				sub: true,
				undef: true,
				//boss: true,
				eqnull: true, // relax
				browser: true,
				regexp: true,
				strict: true,
				trailing: false,
				smarttabs: true,
				lastsemic: true
			},
			globals: {
				jQuery: true,
				console: true
			}
		},
		uglify: {},
		server: {
			port: 8080,
			base: '.'
		},
		less: {
			development: {
				options: {
					paths: ['src']
				},
				files: {
					'src/<%= pkg.name %>.css': 'src/<%= pkg.name %>.less'
				}
			},
			production: {
				options: {
					paths: ['dist'],
					//compress: true,
					yuicompress: true
				},
				files: {
				  'dist/<%= pkg.name %>.min.css': ['src/<%= pkg.name %>.less' ]
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint min less');

};