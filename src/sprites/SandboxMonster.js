import Sprite from './Sprite'

export default class SandboxMonster extends Sprite {
    constructor(config) {
        super(config)
        this.setTexture(config.key)
        this.immovable = true
    }
}