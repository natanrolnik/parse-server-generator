var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();

var applicationId = process.env.APP_ID || process.env.npm_config_APP_ID;
var masterKey = process.env.MASTER_KEY || process.env.npm_config_MASTER_KEY;

var parseApi = new ParseServer({
  databaseURI: process.env.DATABASE_URI || process.env.npm_config_DATABASE_URI,
  cloud: process.env.CLOUD_CODE_MAIN || process.env.npm_config_CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || process.env.npm_config_APP_ID,
  masterKey: process.env.MASTER_KEY || process.env.npm_config_MASTER_KEY,
  serverURL: process.env.SERVER_URL || process.env.npm_config_SERVER_URL || 'http://localhost:1337/{parse-generated-app-serverMount}',
});

app.use('/{parse-generated-app-serverMount}', parseApi);

var port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log('{parse-generated-app-name} running on port ' + port + '.');
});
