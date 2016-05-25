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
    //Config files
    this.copy('_babelrc', '.babelrc');
    this.copy('_bowerrc', '.bowerrc');
    this.copy('_editorconfig', '.editorconfig');
    this.copy('_gitignore', '.gitignore');
    this.copy('_bower.json', 'bower.json');
    this.copy('_gulpfile.js', 'gulpfile.js');
    this.copy('_package.json', 'package.json');


    //Make folders
    this.mkdir('app');
    this.mkdir('app/templates');
    this.mkdir('app/templates/news');
    this.mkdir('app/resources');
    this.mkdir('app/resources/scripts');
    this.mkdir('app/resources/styles');
    this.mkdir('app/resources/fonts');
    this.mkdir('app/resources/images');
    this.mkdir('app/resources/json');

    //Copy files
    this.copy('app/_index.php', 'app/index.php');
    this.copy('app/htaccess', 'app/.htaccess');

    // Templates
    this.copy('app/templates/_404.html', 'app/templates/404.html');
    this.copy('app/templates/_layout.html', 'app/templates/_layout.html');
    this.copy('app/templates/_index.html', 'app/templates/index.html');
    this.copy('app/templates/news/_entry.html', 'app/templates/news/_entry.html');
    this.copy('app/templates/news/_index.html', 'app/templates/news/index.html');

    //Resources
    this.copy('app/resources/scripts/_main.js', 'app/resources/scripts/main.js');
    this.copy('app/resources/scripts/_hello.js', 'app/resources/scripts/hello.js');
    this.copy('app/resources/styles/_main.scss', 'app/resources/styles/main.scss');

    // this.installDependencies();
  }
});

module.exports = CraftcmsGenerator;
