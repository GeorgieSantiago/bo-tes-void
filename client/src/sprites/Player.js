import Sprite from './Sprite'
import CCannon from './projectiles/CCannon'
export default class Player extends Sprite {

    constructor(config) {
        super(config)
        //this.setPipeline("Light2D")
        this.setTexture(config.key)
        this.investigationCoords = config.scene.investigatables
        this.body.setSize(44, 44);
        //this.setCollideWorldBounds(true);
        //this.onWorldBounds = true;
        this.activeScene = config.scene
        this.facing = "down"   
        this.oldPosition = {
            x: this.x,
            y: this.y,
            rotation: this.rotation
        }
        this.id = config.id
    }

    create() {
        this.scene.player.direction = "_idle_down"
    this.scene.cursors = this.scene.input.keyboard.createCursorKeys();
            // Creates object for input with WASD kets
    const moveKeys = this.scene.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

        const acceleration = 180
        // Enable player investigate
        this.scene.input.keyboard.on('keyup', this.handleKeyUp, this);
        // Enables movement of player with WASD keys
        this.scene.input.keyboard.on('keydown_W', function (event) {
            this.body.setVelocityY(-acceleration);
            this.updateLight()
            if( this.scene.player.direction !== "_walk_up" ) this.scene.player.direction = "_walk_up"
            this.play("c1_walk_up")
        }, this);
        this.scene.input.keyboard.on('keydown_S', function (event) {
            this.body.setVelocityY(acceleration);
            this.updateLight()
            if( this.scene.player.direction !== "_walk_down" ) this.scene.player.direction = "_walk_down"
            this.play("c1_walk_down")
        }, this);
        this.scene.input.keyboard.on('keydown_A', function (event) {
            this.body.setVelocityX(-acceleration);
            this.updateLight()
            if( this.scene.player.direction !== "_walk_left" ) this.scene.player.direction = "_walk_left"
            this.play("c1_walk_left")
        }, this);
        this.scene.input.keyboard.on('keydown_D', function (event) {
            this.body.setVelocityX(acceleration);
            this.updateLight()
            if( this.scene.player.direction !== "_walk_right" ) this.scene.player.direction = "_walk_right"
            this.play("c1_walk_right")
        }, this);

        // Stops player acceleration on uppress of WASD keys
        this.scene.input.keyboard.on('keyup_W', function (event) {
        if (moveKeys['down'].isUp)
            this.body.setVelocityY(0);
            this.play("c1_idle_up")
            if( this.scene.player.direction !== "_idle_up" ) this.scene.player.direction = "_idle_up"
            this.facing = "up"
        }, this);
        this.scene.input.keyboard.on('keyup_S', function (event) {
        if (moveKeys['up'].isUp)
            this.body.setVelocityY(0);
            this.play("c1_idle_down")
            if( this.scene.player.direction !== "_idle_down" ) this.scene.player.direction = "_idle_down"
            this.facing = "down"
        }, this);
        this.scene.input.keyboard.on('keyup_A', function (event) {
        if (moveKeys['right'].isUp)
            this.body.setVelocityX(0);
            this.play("c1_idle_left")
            if( this.scene.player.direction !== "_idle_left" ) this.scene.player.direction = "_idle_left"
            this.facing = "left"
        }, this);
        this.scene.input.keyboard.on('keyup_D', function (event) {
        if (moveKeys['left'].isUp)
            this.body.setVelocityX(0);
            this.play("c1_idle_right")
            if( this.scene.player.direction !== "_idle_right" ) this.scene.player.direction = "_idle_right"
            this.facing = "right"
        }, this);

        this.firePower = this.activeScene.physics.add.group({ classType: CCannon, runChildUpdate: true });
        this.moveKeys = moveKeys
    }

    handleKeyUp = ({code}) => {
        const { scene: { props: { freezePlayer }, hud }, investigationCoords, x, y } = this
        if( code === "Space" ) {
            if( !freezePlayer) {
                let obj = investigationCoords.filter(({ x1, y1, x2, y2 }) => (
                    this.isBetween(x, x2, x1) && this.isBetween(y, y2, y1) 
                ))[0]
                     
                if( obj ) { 
                    return hud.showDialog(obj.description.value)
                }
            }
            return hud.closeDialog()
        }

        if( code === "KeyJ" ) {
            const projectile = this.firePower.get().setActive(true).setVisible(true)
            
            if (projectile)
            {
                const coords = {
                    x: this.x,
                    y: this.y
                }
                const { facing } = this
                if( facing === "left" || facing === "right" ) {
                    coords.x += facing === "right" ?  30 : -30
                }

                if( facing === "up" || facing === "down" ) {
                    coords.y += facing === "down" ?  30 : -30
                }

                projectile.fire(this, coords);
                this.scene.physics.add.collider(this.scene.enemies, projectile, this.enemyHitCallback, null, this.scene);
            }
        }

        if( code === "KeyX" ) {
            hud.toggleInventory()
        }

        if( code === "KeyQ" ) {
            hud.fullScreen()
        }
    }

    idle = code => {
        switch(code) {
            case "ArrowUp": 
            case "KeyW":
                this.play("c1_idle_up")
            return;
            case "ArrowDown":
            case "KeyS": 
                 this.play("c1_idle_down")
            case "ArrowLeft":
            case "KeyA":
                 this.play("c1_idle_left")
            return;
            case "ArrowRight":
            case "KeyD":
                 this.play("c1_idle_right")
            return;
            default:
                 return;      
        }
    }

    setRoomBounds(rooms) {
        rooms.forEach(
            (room) => {
                if (this.x >= room.x && this.x <= (room.x + room.width)) {
                    let cam = this.scene.cameras.main;
                    let layer = this.scene.groundLayer;
                    cam.setBounds(room.x, 0, room.width * layer.scaleX, layer.height * layer.scaleY);
                    this.scene.finishLine.active = (room.x === 0);
                    this.scene.cameras.main.setBackgroundColor(room.sky);
                }
            }
        );
    }

    enemyHitCallback(enemyHit, bulletHit)
    {
        console.log("Enemy Hit Callback", enemyHit, bulletHit)
        // Reduce health of enemy
        if (bulletHit.active === true && enemyHit.active === true)
        {
            enemyHit.health = enemyHit.health - 1;
            console.log("Enemy hp: ", enemyHit.health);
    
            // Kill enemy if health <= 0
            if (enemyHit.health <= 0)
            {
               enemyHit.setActive(false).setVisible(false);
            }
    
            // Destroy bullet
            bulletHit.setActive(false).setVisible(false);
        }
    }

    updateLight = () => {
        const { x, y } = this.scene.spotlight
        this.scene.spotlight.setPosition(x, y)
    }
}