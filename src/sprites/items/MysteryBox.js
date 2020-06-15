import Phaser from 'phaser'
import Sprite from '../Sprite'
export default class MysteryBox extends Sprite {
    constructor(config) {
        super(config)
        this.setTexture(config.key)
        this.body.setSize(32, 32)
    }
}