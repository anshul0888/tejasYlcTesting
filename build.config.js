/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [
            'src/*.js',
            'src/**/*.js',
            'src/**/**/*.js',
            'src/app/*.js',
            'src/app/**/**/*.js',
            'src/app/**/**/**/*.js',


            '!src/**/*.spec.js',
            '!src/**/**/*.spec.js',
            '!src/app/**/**/*.spec.js',
            '!src/app/**/**/tests/*.spec.js',
            '!src/assets/**/*.js'
    ],
    jsunit: [
      'src/**/*.spec.js',
      'src/app/**/**/tests/*.spec.js'
    ],
    coffee: [
      'src/**/*.coffee',
      '!src/**/*.spec.coffee'
    ],
    coffeeunit: [
      'src/**/*.spec.coffee'
    ],
    atpl: [
      'src/app/**/*.tpl.html',
      'src/app/**/**/views/*.tpl.html',
      'src/app/**/views/*.tpl.html',
      'src/app/**/**/views/**/*.tpl.html',
      'src/app/**/**/views/**/**/*.tpl.html'
    ],
    ctpl: [
      'src/common/**/*.tpl.html'
    ],

    html: [
      'src/index.html'
    ],

    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
        'vendor/jquery/dist/jquery.min.js',
        'vendor/angular/angular.min.js',
        'vendor/bootstrap/dist/js/bootstrap.min.js',
        'vendor/angular-bootstrap/ui-bootstrap.min.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.min.js',
        'vendor/angular-touch/angular-touch.min.js',
        'vendor/firebase/firebase.js',
        'vendor/angularfire/dist/angularfire.min.js',
        'vendor/angular-cookies/angular-cookies.min.js',
        'vendor/angular-gettext/dist/angular-gettext.min.js',
        'vendor/angular-toasty/js/ng-toasty.min.js',
        'vendor/angular-sweetalert/SweetAlert.min.js',
        'vendor/angular-animate/angular-animate.min.js',
        'vendor/sweetalert/dist/sweetalert.min.js',
        'vendor/algoliasearch/dist/algoliasearch.angular.min.js',
        'vendor/algoliasearch-helper/dist/algoliasearch.helper.min.js',
        'vendor/angular-permission/dist/angular-permission.js',
        'vendor/Faker/build/build/build/faker.min.js',
        'vendor/angular-google-places-autocomplete/dist/autocomplete.min.js',
        'vendor/firebase-util/dist/firebase-util.min.js',
        'vendor/ng-tags-input/ng-tags-input.min.js',
        'vendor/angular-tags/jsTag.min.js',
        'vendor/angular-loading-bar/build/loading-bar.min.js',
        'vendor/angular-sanitize/angular-sanitize.min.js',
        'vendor/videogular/videogular.min.js',
        'vendor/videogular-angulartics/vg-analytics.min.js',
        'vendor/videogular-buffering/vg-buffering.min.js',
        'vendor/videogular-controls/vg-controls.min.js',
        'vendor/videogular-ima-ads/vg-ima-ads.min.js',
        'vendor/videogular-overlay-play/vg-overlay-play.min.js',
        'vendor/videogular-poster/vg-poster.min.js',
        'vendor/geofire/dist/geofire.min.js',
        'vendor/angularGeoFire/dist/angularGeoFire.min.js',
        'vendor/ngMeta/dist/ngMeta.min.js',
        'vendor/braintree-angular/dist/braintree-angular.js',
        'vendor/html5shiv/dist/html5shiv.min.js',
        'vendor/angular-socialshare/angular-socialshare.min.js',
        'vendor/filepicker-js-bower/filepicker.min.js',
        'vendor/ng-idle/angular-idle.min.js',
        'vendor/spin.js/spin.min.js',
        'vendor/angular-spinner/angular-spinner.min.js',
        'vendor/moment/moment.js',
        'vendor/angular-moment/angular-moment.min.js',
        'vendor/satellizer/satellizer.min.js',
        'vendor/angular-jwt/dist/angular-jwt.min.js',
        'vendor/angular-notify/dist/angular-notify.min.js',
        'vendor/angular-block-ui/dist/angular-block-ui.min.js',
        'vendor/angular-filter/dist/angular-filter.min.js',
        'vendor/gm.datepickerMultiSelect/dist/gm.datepickerMultiSelect.min.js',
        'vendor/angular-modal-service/dst/angular-modal-service.min.js',
        'vendor/angular-video-bg/angular-video-bg.min.js',
        'vendor/angulartics/dist/angulartics.min.js',
        'vendor/angulartics-google-analytics/dist/angulartics-ga.min.js',
        'vendor/angular-update-meta/dist/update-meta.min.js',
        'vendor/picturefill/dist/picturefill.min.js',
        'vendor/underscore/underscore-min.js',
        'vendor/twilio-common.min/index.js',
        'vendor/twilio-ip-messaging.min/index.js'
    ],
    css: [
        'vendor/angular-loading-bar/build/loading-bar.css',
        'vendor/angular-toasty/css/ng-toasty.css',
        'vendor/sweetalert/dist/sweetalert.css',
        'vendor/angular-google-places-autocomplete/dist/autocomplete.min.css',
        'vendor/ng-tags-input/ng-tags-input.css',
        'vendor/angular-tags/jsTags.css',
        'vendor/slick-carousel/slick/slick.css',
        'vendor/slick-carousel/slick/slick-theme.css',
        'vendor/videogular-theme-default/videogular.min.css',
        'vendor/angular-notify/dist/angular-notify.min.css',
        'vendor/angular-block-ui/dist/angular-block-ui.css',
        'vendor/font-awesome/css/font-awesome.min.css',
        'vendor/font-awesome/css/font-awesome.css.map',
        'vendor/bootstrap/dist/css/bootstrap.min.css',
        'vendor/bootstrap/dist/css/bootstrap-theme.min.css',
        'vendor/bootstrap/dist/css/bootstrap.css.map',
        'vendor/bootstrap/dist/css/bootstrap-theme.css.map'
    ],
    assets: [
        'assets/font/fontawesome-webfont.eot',
        'assets/font/fontawesome-webfont.svg',
        'assets/font/fontawesome-webfont.ttf',
        'assets/font/fontawesome-webfont.woff',
        'assets/font/FontAwesome.otf',
        'assets/font/glyphicons-halflings-regular.eot',
        'assets/font/glyphicons-halflings-regular.svg',
        'assets/font/glyphicons-halflings-regular.ttf',
        'assets/font/glyphicons-halflings-regular.woff',
        'assets/font/glyphicons-halflings-regular.woff2'
    ],
      fonts: [
          'assets/proximanova-bold-webfont.ttf',
          'assets/proximanova-extrabold-webfont.ttf',
          'assets/proximanova-light-webfont.ttf',
          'assets/proximanova-regular-webfont.ttf',
          'assets/proximanova-semibold-webfont.ttf',
          'vendor/videogular-themes-default/fonts/videogular.svg',
          'vendor/videogular-themes-default/fonts/videogular.eot',
          'vendor/videogular-themes-default/fonts/videogular.ttf',
          'vendor/videogular-themes-default/fonts/videogular.woff',
          'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
          'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf'
      ]
  }
};
