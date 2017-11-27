module.exports = function(grunt){

	var lrPort = 35729;

	require('matchdep').filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		uglify:{
			options:{
				stripBanners:true,
 				banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build:{
				src:'src/*.js',
				dest:'build/built.js'
			}
		},
		jshint:{
			build:['Gruntfile.js','src/*.js'],
			options:{
				jshintrc:'./jshintrc/.jshintrc'
			}
		},
		concat: {
		  options: {
		   //文件内容的分隔符
		    separator: ';',
		    stripBanners: true,
		    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		            '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
		  	},
		  	dist: {
		    	src: ['src/*.js'], //合并此目录下所有文件
		    	dest: 'build/built.js' //之后存放在build目录下并命名为built.js
		 	}
		},
		cssmin: { //css压缩、合并
		  options: { 
		     keepSpecialComments: 0,
		  }, 
		  compress: { 
		    files: { 
				    'build_css/default.css': [ 
				        "build_css/css/*.css", 
				        "!build_css/css/other.css",
		      		] 
		    	} 
		   	} 
		},
		watch:{
  			build:{
		        files:['src/css/*.less','src/*.js','src/*.html'],//分别监控目录下的所有JS和css
		        tasks:['less','jshint','concat','uglify','cssmin'],//不管JS还是CSS有变动按此顺序执行一边
		        options:{
		        	spawn:false,
		        	livereload: lrPort
		        }
		    }
		},
		 connect: {
            server: {
                options: {
                	open:true,
                	protocol: 'http', 
                    port: 8000,
                    hostname: '*',
                    livereload: lrPort,
                    keepalive: false,
                    base: ['src/','build/','build_css']
                }
            }
        },
        less:{
        	build:{
        		files:[{
        			expand:true,
        			cwd:'src',
        			src:'**/*.less',
        			dest:'build_css/',
        			ext:'.css'
        		}]
        	}
        }
	});




	grunt.registerTask('default',['less:build','jshint','concat','uglify','cssmin','connect','watch']);
};