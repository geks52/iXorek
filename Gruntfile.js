const appFolder = 'app/iXorek/';
const distFolder = 'dist/iXorek/';
const scripts = [
  `${appFolder}iXorek.js`,
  `${appFolder}bg.js`,
  `${appFolder}options/options.js`,
];
const scriptsTemp = [
  'temp/app/iXorek/iXorek.js',
  'temp/app/iXorek/bg.js',
  'temp/app/iXorek/options/options.js',
];

module.exports = (grunt) => {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: [
          {
            expand: true,
            cwd: appFolder,
            src: ['options/options.html'],
            dest: distFolder,
          },
        ],
      },
    },
    imagemin: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: appFolder,
            src: ['**/*.{png,jpg,gif}'],
            dest: distFolder,
          },
        ],
      },
    },
    eslint: {
      target: scripts,
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env'],
      },
      dist: {
        files: [
          {
            expand: true,
            src: scripts,
            dest: 'temp/',
          },
        ],
      },
    },
    uglify: {
      options: {
        stripBanners: true,
        banner:
          '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dist: {
        files: [
          {
            'dist/iXorek/iXorek.js': scriptsTemp[0],
            'dist/iXorek/bg.js': scriptsTemp[1],
            'dist/iXorek/options/options.js': scriptsTemp[2],
          },
        ],
      },
    },
    csso: {
      compress: {
        options: {
          report: 'gzip',
        },
        files: {
          'dist/iXorek/options/options.css': [
            `${appFolder}options/options.css`,
          ],
        },
      },
    },
    clean: ['temp/**/*', 'dist/**', 'dist/.DS_Store'],
    compress: {
      main: {
        options: {
          archive: 'iXorek.zip',
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['**/*', '_locales/**', 'manifest.json'],
            dest: '',
          },
        ],
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'app/',
            src: ['_locales/**', 'iXorek/options/options.css'],
            dest: 'dist/',
          },
        ],
      },
      manifest: {
        src: 'app/manifest.json',
        dest: 'dist/manifest.json',
        options: {
          /*
                    process: function(content, srcpath) {
                      return content.replace('bg.js', 'bg.min.js').replace('iXorek.js', 'iXorek.min.js');
                    }
          */
        },
      },
    },
    watch: {
      files: ['<%= eslint.target %>'],
      tasks: ['eslint'],
    },
  });
  grunt.registerTask('default', ['eslint', 'watch']);
  grunt.registerTask('build', [
    'clean',
    'copy',
    'babel',
    'uglify',
    'csso',
    'htmlmin',
    'imagemin',
    'compress',
  ]);
};
