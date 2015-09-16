/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('craftcms generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('craftcms:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'package.json',
      'bower.json',
      'gulpfile.js',
      'config.rb',
      'app/index.php',
      'app/.htaccess',
      'app/templates/404.html',
      'app/templates/_layout.html',
      'app/templates/index.html',
      'app/templates/news/_entry.html',
      'app/templates/news/index.html',
      'app/resources/js/app.js',
      'app/resources/sass/main.scss',
      '.bowerrc',
      '.gitignore',
      '.jshintrc'
    ];

    helpers.mockPrompt(this.app, {
      'craftLicense': true
    });
    this.app.options['skip-install'] = true;
    this.app.run(function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
