var path = require('path');
var questions = require('./questions.js');
var inquirer = require('inquirer');
var fs = require('fs');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

var baseDirectory;
var serverMount;
var serverURL;

var npmrcVariables = {'appName': 'APP_NAME',
                      'applicationId': 'APP_ID',
                      'masterKey': 'MASTER_KEY',
                      'databaseURI': 'DATABASE_URI',
                      'serverURL': 'SERVER_URL',
                      'cloudPath': 'CLOUD_CODE_MAIN'
};

module.exports = initialize;

function initialize(config) {
  questions(config).then(function (answers) {
    config = Object.assign(config, answers);
    console.log(JSON.stringify(config, null, 2));
    return inquirer.prompt({
      type: 'confirm',
      name: 'next',
      message: 'About to copy the files from templates. Does the above look correct?',
      default: true,
    });
  }).then(function(confirmed) {
    if (!confirmed.next) {
      console.log('Aborted!');
      process.exit();
    }

    baseDirectory = config.directory;
    serverMount = config.parseMount;

    if (serverMount.indexOf('/') == 0) {
      serverMount = serverMount.slice(1);
    }

    protocol = config.https ? 'https' : 'http';
    serverURL = protocol + '://' + path.join(config.serverDomain, serverMount);

    if (baseDirectory != '.') {
      createDirectory(baseDirectory);
    }

    copyTemplateFiles(config);
  }).then(function() {
    var npmrcToWrite = generateNpmrcContents(config);

    console.log("Creating the .npmrc file. For more information on how to use it:\nhttps://docs.npmjs.com/files/npmrc");
    write(path.join(baseDirectory, '.npmrc'), npmrcToWrite);

    console.log("Configuration is complete. Installing dependencies...");
    exec('npm install', {cwd: baseDirectory}, function(error, stdout, stderr) {
      if (error) {
        console.log(error);
        process.exit(1);
      }

      console.log("Dependencies installed");
      console.log("Now just run 'npm start' and your server should be running on port 1337.");
      console.log("Happy Parse-ing :)");
      process.exit();
    });
  }).catch(function(error) {
    console.log(error);
    process.exit(1);
  });
}

function copyTemplateFiles(config) {
  var finalCloudPath = path.join(baseDirectory, config.cloudPath);
  createDirectory(path.dirname(finalCloudPath));
  copy_template('cloud/main.js', finalCloudPath);
  copy_template('index.js', path.join(baseDirectory, 'index.js'), {'parse-generated-app-name': config.appName, 'parse-generated-app-serverMount': serverMount});
  copy_template('package.json', path.join(baseDirectory, 'package.json'), {'parse-generated-app-name': config.appName});
  copy_template('.gitignore.template', path.join(baseDirectory, '.gitignore'));
  copy_template('README.md', path.join(baseDirectory, 'README.md'), {'parse-generated-app-name': config.appName, 'parse-generated-app-serverURL': serverURL});
}

function generateNpmrcContents(config) {
  var npmrcContents = Object.keys(npmrcVariables).filter(function(value) {
    return value != 'serverURL';
  }).map(function(value, index) {
    return npmrcVariables[value] + '=' + config[value];
  });

  var npmrcToWrite = npmrcContents.join('\n')
                  + '\n\n'
                  + '#in order to deploy to Heroku, Dokku, or other service, set the following environment variables:\n'
                  + "#Ex.: 'heroku config:set MyAppName' followed by:\n"
                  + '#'
                  + npmrcContents.join(' ')
                  + npmrcVariables['serverURL'] + '=' + serverURL;

  return npmrcToWrite;
}

function write(path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || 0666 });
  console.log('   \x1b[36mcreate\x1b[0m: ' + path);
}

function copy_template(from, to, rename) {
  var contents = loadTemplate(from);

  if (rename) {
    for (var key in rename) {
      var toReplace = '{' + key + '}';
      while (contents != contents.replace(toReplace, rename[key])) {
        contents = contents.replace(toReplace, rename[key])
      }
    }
  }

  write(to, contents);
}

function createDirectory(path) {
  mkdirp.sync(path)
  console.log('   \033[36mcreate dir.\033[0m: ' + path);
}

function loadTemplate(name) {
  return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf-8');
}
