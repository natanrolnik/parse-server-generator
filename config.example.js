module.exports = {
  appName: "YourAppName",
  applicationId: "YourAppApplicationId",
  masterKey: "YourAppMasterKey",
  databaseURI: "mongodb://<user>:<password>@<host>:<port>/<databaseName>?ssl=<trueOrFalse>",
  cloudPath: "cloud/main.js",
  parseMount: "parse",
  serverDomain: "www.yourappdomain.com", //the domain where your app will run.
  https: true, //set it to false if you prefer to run it without HTTPS (not recommended)
  //directory: "server-side" //leave empty for current directory ('.')
}
