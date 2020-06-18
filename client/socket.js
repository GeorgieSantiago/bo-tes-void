//Get .env
//require('dotenv').config()
//Create Express and Socket.io server
const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io').listen(server);
const faker   = require('faker');
const host    = process.env.SOCKET_URL  || "192.168.1.3"
const port    = process.env.SOCKET_PORT || "8081"

/**
 * Generator functions
 */
const generators = {
  between: (min, max) => Math.random(min, max) * 10,
  units: count => {
    const genders = [
      "Male",
      "Female",
      "Non-Binary"
    ]

    const jobs = [
      "Engineer",
      "Medic",
      "Pilot",
      "Scientist"
    ]

    const generatedUnits = []
    for(let i = 0; i <= count; i++) {
        generatedUnits.push({
          name: faker.name.findName(),
          gender: genders[faker.random.number(genders.length - 1)],
          age: Math.random(18, 40),
          job: jobs[faker.random.number(jobs.length - 1)],
        })
    }

    return generatedUnits
  }
}
//Create player log
const players = {}
//Deployed characters
const deployed = {}
/**
 * Planet data
 */
const planets = {
  sandbox: {
    enemies: [
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        { x: Math.random(200, 500), y: Math.random(300, 400 )},
        
    ],
    units: generators.units(5)
  }
}

/**
 * Socket Routes
 */
io.on('connection', function (socket) {
    players[socket.id] = {
       activeCrewmate: null,
       x: 0,
       y: 0,
       id: socket.id
    }

    /**
     * Get player save state
     */
    socket.on('save_state_token', token => {

    })
    
    // send the players object to the new player
    socket.emit('player_join', players);
    // run sandbox level and send data to game
    socket.emit('planet_info', { ...planets['sandbox'], playerCount: players.length})
    // update all other players of the new player
    socket.broadcast.emit('player_joining', players[socket.id]);
    // Player deployed
    socket.on('player_deploy', characterInfo => {
       console.log(characterInfo, "Player")
       socket.broadcast.emit('player_deployed', characterInfo)
    })
    // Player spectate
    socket.on('player_spectate', () => {
      socket.broadcast.emit('player_spectating')
    })
    // Player is at camp
    socket.on('player_camp', (id) => {
      console.log("Player has camped", id)
      socket.broadcast.emit('player_camped', id)
    })
    //Player Eliminated
    socket.on('player_eliminate', (id) => {
      console.log("Player eliminated", id)
      socket.broadcast.emit('player_eliminated', id)
    })    
    // Player Moved
    socket.on('player_move', ({ id, coords, direction }) => {
        socket.broadcast.emit('player_moved', {id, coords, direction})
    })
    // Player Fired
    socket.on('player_fired', (player, effect) => {
        console.log("Player has fired", player)
        //Update the players of a players move
        socket.broadcast.emit('player_fired', player)
    })
    //Update Health
    socket.on('player_health', (id, health) => {
      console.log("Players health updated", id, health)
      //Update the players of a players move
      socket.broadcast.emit('player_health_update', {id, health})
    })
    //Update Sanity
    socket.on('player_sanity', (id, sanity) => {
      console.log("Players sanity updated", id, sanity)
      //Update the players of a players move
      socket.broadcast.emit('player_sanity_update', { id, sanity })
    })
    //Update Hunger
    socket.on('player_hunger', (id, hunger) => {
      console.log("Players hunger updated", id, hunger)
      //Update the players of a players move
      socket.broadcast.emit('player_health_update', {id, hunger})
    })
    //Update Inventory

    //Update Planet Progress

    //Player has disconnected from the server
    socket.on('disconnect', function (socket) {
        console.log('user disconnected', socket);
    });
});

server.listen(port, host , function () {
  //Perhapse it is possible to auto rebuild?
  console.log(`Listening on ${host}:${server.address().port}`);
});