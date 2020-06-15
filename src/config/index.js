import Phaser from 'phaser'
import scenes from './scenes'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

export default {
    type: Phaser.AUTO,
    pixelArt: true,
    antialias: false, 
    roundPixels: true,
    parent: 'content',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: 1024,
        height: 1024
    },
    scene: scenes,
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        },
            // ...
        ]
    }
}