const express = require('express');
const app     = express();
const server  = require('http').Server(app);
//require('dotenv').config()
const host    = process.env.APP_URL  || "0.0.0.0"
const port    = process.env.APP_PORT || "3000"

//Set root directory
app.use(express.static(__dirname + '/src'));
//Set route handler
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/src/index.html');
});
//Start the mother fuckin server
server.listen(port, host , function () {
  //Perhapse it is possible to auto rebuild?
  console.log(`Listening on ${host}:${server.address().port}`);
});