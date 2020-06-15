require('dotenv').config()
const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const host    = process.env.APP_URL  || "192.168.1.3"
const port    = process.env.APP_PORT || "8080"

//Set root directory
app.use(express.static(__dirname + '/www'));
//Set route handler
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
//Start the mother fuckin server
server.listen(port, host , function () {
  //Perhapse it is possible to auto rebuild?
  console.log(`Listening on ${host}:${server.address().port}`);
});