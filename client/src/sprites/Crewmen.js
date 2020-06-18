import Sprite from './Sprite'

export default class Crewmen extends Sprite {
    constructor(config) {
        super(config)
        //this.setPipeline("Light2D")
        this.setTexture(config.key)
        this.investigationCoords = config.scene.investigatables
        this.body.setSize(44, 44)
        //this.setCollideWorldBounds(true);
        //this.onWorldBounds = true;
        this.activeScene = config.scene
        this.facing = 'down'
        this.setDataEnabled()
    }
}