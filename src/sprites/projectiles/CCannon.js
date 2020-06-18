import Phaser from 'phaser'

export default class CCannon extends Phaser.GameObjects.Image
{
    constructor(scene) {
        super(scene, 0, 0, 'ccannon');
        scene.add.existing(this);
        this.speed = Phaser.Math.GetSpeed(400, 1);
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
        this.expires = 1000
    }

        // Fires a bullet from the player to the reticle
        fire = (shooter, target) => 
        {
            this.setPosition(shooter.x, shooter.y); // Initial position
            this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));
    
            // Calculate X and y velocity of bullet to moves it from shooter to target
            if (target.y >= this.y)
            {
                this.xSpeed = this.speed*Math.sin(this.direction);
                this.ySpeed = this.speed*Math.cos(this.direction);
            }
            else
            {
                this.xSpeed = -this.speed*Math.sin(this.direction);
                this.ySpeed = -this.speed*Math.cos(this.direction);
            }
    
            this.rotation = shooter.rotation; // angle bullet with shooters rotation
            this.born = 0; // Time since new bullet spawned
        }
    
        // Updates the position of the bullet each cycle
        update(time, delta) {
            this.expires -= 0.1
            this.x += this.xSpeed * delta;
            this.y += this.ySpeed * delta;
            this.born += delta;

            if( this.expires <= 0 || this.born > 1800 ) {
                this.destruct()
            }
        }

        destruct() {
            this.setActive(false)
            this.setVisible(false)
        }
    
}