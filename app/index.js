'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var CraftcmsGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    var self = this;

    this.on('end', function () {
      if (!this.options['skip-install']) {
        //Download and extract Craft

        this.extract('http://buildwithcraft.com/latest.zip?accept_license=yes', './', function(err, remote) {
          if (err) {
            console.log(err);
          } else {
            console.log('-----------------------------');
            console.log("Craft download completed!");
            console.log('-----------------------------');

            //Create storage folder for craft
            self.mkdir('craft/storage');
          }

        });
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Craftcms generator!'));

    var prompts = [{
      type: 'confirm',
      name: 'craftLicense',
      message: 'I agree to the terms and conditions. http://buildwithcraft.com/license',
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.craftLicense = props.craftLicense;
      if(this.craftLicense){
        done();
      } else {
        console.log('');
        console.log("You have yo agree with the license to download craft!");
        console.log('');

      }
    }.bind(this));
  },

  app: function () {
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_gulpfile.js', 'gulpfile.js');
    this.copy('_config.rb', 'config.rb');

    this.mkdir('app');
    this.mkdir('app/templates');
    this.mkdir('app/templates/news');
    this.mkdir('app/resources');
    this.mkdir('app/resources/css');
    this.mkdir('app/resources/js');
    this.mkdir('app/resources/sass');
    this.mkdir('app/resources/fonts');
    this.mkdir('app/resources/images');
    this.mkdir('app/resources/json');

    this.copy('app/_index.php', 'app/index.php');
    this.copy('app/htaccess', 'app/.htaccess');
    //Basic tamplates
    this.copy('app/templates/_404.html', 'app/templates/404.html');
    this.copy('app/templates/_layout.html', 'app/templates/_layout.html');
    this.copy('app/templates/_index.html', 'app/templates/index.html');
    // The basic news page templates
    this.copy('app/templates/news/_entry.html', 'app/templates/news/_entry.html');
    this.copy('app/templates/news/_index.html', 'app/templates/news/index.html');

    //Resources
    this.copy('app/resources/js/_app.js', 'app/resources/js/app.js');
    this.copy('app/resources/sass/_main.scss', 'app/resources/sass/main.scss');
    this.copy('app/resources/css/_main.css', 'app/resources/css/main.css');

    // this.installDependencies();
  },

  projectfiles: function () {
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = CraftcmsGenerator;
