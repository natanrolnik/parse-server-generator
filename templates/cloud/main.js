//add your own functions here
Parse.Cloud.define("hello", function(request, response) {
  response.success("world!");
});
