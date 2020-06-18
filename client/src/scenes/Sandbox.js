import Scene from './Scene'
import { Player, SandboxMonster, Crewmen } from '../sprites'
import HUD from './HUD';
import io from 'socket.io-client'
import { eventEmit, eventBroadcast } from '../multiplayer/event'

class Sandbox extends Scene {
    constructor(test) {
        super({
            key: 'Sandbox',
            tile: "thebar"
        });
    }
    
    preload() {

    }

    /**
     * Sandbox Planet
     */
    create() {
        //Launch connection to the socket
        this.socket = io('http://192.168.1.3:8081')
        const { scaleRatio } = this.props
        this.investigatables = []
        this.deployed = false
        /**
         * Scene Light
         */
        this.lights.enable().setAmbientColor(0x666666);
        this.spotlight  = this.lights.addLight(500, 250, 200).setIntensity(2);
        this.lights.addLight(400, 300, 20).setIntensity(1.0);
        /**
        * Load music
        */
        this.music = this.game.sound.add('safe_room');
        this.music.loop = true
        this.music.play();
        /**
         * Load HUD
         */
        this.hud = new HUD(this, this.music)
        this.scene.add("HUD",this.hud)
        // Add the map + bind the tileset
        this.map = this.make.tilemap({key: "planet"});
        // Add current assets
        const floor = this.map.addTilesetImage("floor_atlas")
        //Create the map
        this.floor = this.map.createStaticLayer("floor", floor)//.setPipeline('Light2D')
        this.water = this.map.createStaticLayer("water", floor)//.setPipeline('Light2D')
        this.floor.setCollisionBetween(6769, 7156)
        this.water.setCollisionBetween(8466, 8598)   
        //Configure players
        this.enemies = this.add.group();
        this.player = null
        this.teamPlayers = this.physics.add.group();
        //Print joining message to screen
        this.hud.showDialog("Joining Game...")
        //Once connected
        this.socket.on('connect',(socket) => {
        console.log("Connection penis")
        eventEmit("test", this.socket)
        const playerStart = this.map.getObjectLayer('player_start')['objects']
        /**
         * Add enemies
         */

         this.socket.on('planet_info', planet => {
             let monsterId = 0
             //Generate enemies
             planet.enemies.forEach(enemy => {
                const sandboxMonster = new SandboxMonster({
                    x: enemy.x,
                    y: enemy.y,
                    key: "sandbox_monster",
                    scene: this,
                    scale: scaleRatio
                })

                sandboxMonster.id = monsterId++ // 0
                //  This creates a new Phaser.Sprite instance within the group
                //  It will be randomly placed within the world and use the 'baddie' image to display
                this.enemies.add(sandboxMonster)
             })
             //Units for players
             this.units = planet.units
             //Get planet current time
             //this.currentTime = planet.time
        }, this)

       /**
        * Add all players
        */
       this.socket.on('player_join', players => {

        /**
         * Joining workflow.
         * @step1 Player joins. 
         * @step2 player id is added as active player
         * @step3 Character select menu opens
         * @step4 Player selects character
         * @step5 Player class is created with player info stored into it
         * @step6 Game starts
         */
        const ids = Object.keys(players)
           ids.map(id => {
               if(players[id].id === this.socket.id) {
                   this.activePlayer = id
                } else {
                   const teammate = new Crewmen({
                       scene: this,
                       key: 'c1',
                       x: 0,
                       y: 0, 
                       scale: scaleRatio,
                    })
                    teammate.playerId = id
                    this.teamPlayers.add(teammate)
               }
            })
        })

      this.socket.on('player_spectating', () => {
          console.log("Player spectating")
      })

       this.socket.on('player_deployed', playerInfo => {
           console.log("Player deployed", playerInfo)
           this.player = new Player({
            scene: this,
            key: 'c1',
            x: 0,
            y: 0, 
            scale: scaleRatio,
           })
                     /**
            * Genrate player configuration
            */
           this.player.create()
           //this.mapInvestigatableObjects(player, this.map.getObjectLayer('investigate')['objects'], this)
           this.physics.add.collider(this.player, [
               this.floor,
               this.water,
               this.enemies
           ]);
           this.cameras.main.startFollow(this.player);
           this.player.direction = "_idle_down"
       })

       /**
        * Add additional players
        */
       this.socket.on('player_joining', (newPlayer) => {
        //this.mapInvestigatableObjects(player, this.map.getObjectLayer('investigate')['objects'], this)
        const joining = new Crewmen({
            scene: this,
            key: 'c1',
            x: 0,
            y: 0, 
            scale: scaleRatio,
        })
        joining.playerId = newPlayer.id
        this.teamPlayers.add(joining)
        })

       this.socket.on('player_moved', ({id, coords, direction}) => {
           this.teamPlayers.getChildren().forEach(function(crewmen) {
               if(crewmen.playerId === id) {
                  //Capture animation next
                  crewmen.play(`c1${direction}`)  
                  crewmen.setPosition(coords.x, coords.y)
               }
           })
       })

       this.socket.on('remove_crewment', playerId => {
           console.log("Player to remove", playerId)
       })

        /**
         * Camera settings
         */
        //const { width, height } = this.floor.getBounds();
        //this.cameras.main.setViewport(player.x,player.y,width,height)
        this.cameras.main.roundPixels = true;
        this.cameras.main.setZoom(1.5)
        this.scene.sendToBack();
        this.scale.on('resize', this.resize, this);
        })
    }
    
    update(time, delta) {
         if(this.player) {
             // emit player movement
             const { x, y, rotation } = this.player
             if( this.player.oldPosition &&
                (
                    x !== this.player.oldPosition.x ||
                    y !== this.player.oldPosition.y  ||
                    rotation !== this.player.oldPosition.rotation
                )) {
                    this.socket.emit("player_move", { id: this.activePlayer, coords: { x, y, rotation }, direction: this.player.direction })
                }
            // save old position data
            this.player.oldPosition = {
                x,
                y,
                rotation
            }

         }
    }


    resize (gameSize, baseSize, displaySize, resolution)
    {
        const { width, height } = this.floor.getBounds();


        this.cameras.resize(width, height);

        //this.bg.setSize(width, height);
    }
}

export default Sandbox;
