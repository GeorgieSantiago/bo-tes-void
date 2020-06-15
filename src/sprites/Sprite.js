/*
Generic enemy class that extends Phaser sprites.
Classes for enemy types extend this class.
*/

export default class Sprite extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y - 16, config.key)
        config.scene.physics.world.enable(this)
        // start still and wait until needed
        this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(true)
        this.body.allowGravity = false
        //config.scene.make.sprite({key: "martha"})
        // Standard sprite is 16x16 pixels with a smaller body
        this.setScale(config.scaleRatio)
        //this.body.offset.set(10, 12);

        /**
         * Configure game elements
         */
        this.hasDialog = false
        this.dialog = ''
        config.scene.add.existing(this)
    }

    setDialog(content) {
        this.hasDialog = true
        this.dialog = content
    }

    isBetween(n, a, b) {
        const x     = Math.round(n)
        const y     = Math.round(a)
        const z     = Math.round(b)
        const floor = y < z ? (y) : (z)
        const ceil  =  floor === y ? (z) : (y)
        return x > floor && x < ceil ? true : false
    }
}
