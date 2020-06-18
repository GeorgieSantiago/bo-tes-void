import { Martha } from '../../sprites/'
import Scene from '../Scene'
class IntroScene extends Scene {
    constructor(test) {
        super({
            key: 'IntroScene',
            tile: 'test'
        })
    }

    preload() {
        //this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create() {

    }

    update(time, delta) {

    }
}

export default IntroScene
