var inquirer = require('inquirer');
module.exports = questions;

//still missing:
//parse server path (defaults to '/parse');

console.log('Hi, let\'s create your Parse Server app.');

function questions(config) {
  console.log('Please answer the following questions:');
  return inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is the name of your app?',
      when: !config.appName
    },
    {
      type: 'input',
      name: 'applicationId',
      message: 'Set an application id (min. length 15):',
      when: !config.applicationId,
      validate: function (value) {
        if (value.length > 15) {
          return true;
        }

        return 'Please enter an applicationId at least 15 characters long';
      }
    },
    {
      type: 'input',
      name: 'masterKey',
      message: 'Set the Master Key (min. length 15):',
      when: !config.masterKey,
      validate: function (value) {
        if (value.length > 15) {
          return true;
        }

        return 'Please enter a master key at least 15 characters long';
      }
    },
    {
      type: 'input',
      name: 'databaseURI',
      message: 'What is your Mongo database URI?',
      when: !config.databaseURI,
      validate: function (value) {
        return true;
      }
    },
    {
      type: 'input',
      name: 'cloudPath',
      message: 'What is the path of your main Cloud file? Leave empty for',
      when: !config.cloudPath,
      default: 'cloud/main.js',
    },
    {
      type: 'input',
      name: 'parseMount',
      message: "Where will parse be available at?. Leave empty for '/parse'",
      when: !config.parseMount,
      default: '/parse'
    },
    {
      type: 'input',
      name: 'serverDomain',
      when: !config.serverDomain,
      message: "What will be the Server Domain? Ex.: 'yourapp.heroku.com', (without http and without",
    },
    {
      type: 'confirm',
      name: 'https',
      when: !config.https,
      message: "Are you running on https? Hit enter if yes. https is recommended.",
      default: true
    },
    {
      type: 'input',
      name: 'directory',
      when: !config.directory,
      message: "Where should the project be created at? Leave empty for the current directory.",
      default: '.'
    },
  ]);
}
