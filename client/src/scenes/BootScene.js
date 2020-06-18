//import makeAnimations from '../helpers/animations';
import Scene from './Scene'

class BootScene extends Scene {
    constructor(test) {
        super({
            key: 'BootScene',
            tile: ''
        })
    }
    
    preload() {
        this.progress = this.add.graphics()
        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            this.progress.clear()
            this.progress.fillStyle(0xffffff, 1)
            this.progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60)
        })

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            this.progress.destroy()
            this.scene.start('TitleScene')
        }, this)

        const humanSize =  { frameWidth: 64, frameHeight: 64 }
        const itemSize = { frameWidth: 32, frameHeight: 32 }
        /**@TODO */
        const mapLimit = {}

        this.mapManifest = require('../manifest/maps-manifest.json')
        this.characterManifest = require('../manifest/characters-manifest.json')
        this.imageManifest = require('../manifest/images-manifest.json')
        this.audioManifest = require('../manifest/audio-manifest.json')
        this.enemiesManifest = require('../manifest/enemies-manifest.json')
        this.itemsManifest = require('../manifest/items-manifest.json')
        /**
         * Autoload character sheets and animation
         */
        try {
            this.characterManifest.files.map(({label, path}) => {
                this.load.spritesheet(label, path, humanSize)
            })
        } catch(e) {
            console.log('An error occured loading characters ',  { e })
        }

        /**
         * Autoload items sheets
         */
        try {
            this.itemsManifest.files.map(({label, path}) => {
                this.load.spritesheet(label, path, itemSize)
            })
        } catch(e) {
            console.log('An error occured loading characters ',  { e })
        }
        /**
         * Autoload maps
         */
        try {
            this.mapManifest.files.map(({label, path}) => {
                this.load.tilemapTiledJSON(label, path)
            })
        } catch(e) {
            console.log('An error occured loading maps ',  { e })
        }
        /**
         * Autoload raw assets
         */
        try {
            this.imageManifest.files.map(({label, path}) => {
                this.load.image(label, path)
            })
        } catch(e) {
            console.log('An error occured loading assets ',  { e })
        }

        /**
         * Autoload raw audio
         */
        try {
            this.audioManifest.files.map(({label, path}) => {
                this.load.audio(label, path)
            })
        } catch(e) {
            console.log('An error occured loading audio ',  { e })
        }

        /**
         * Autoload Enemies
         */
        try {
            this.enemiesManifest.files.map(({label, path}) => {
                this.load.spritesheet(label, path, {frameHeight: 32, frameWidth: 32})
            })
        } catch(e) {
            console.log('An error occured loading audio ',  { e })
        }
    }

    create() {
        try {
            this.characterManifest.files.map(({label}) => {
                this.generateCharacterAnimation(label)
            })
        } catch(e) {
            throw e
        }

        /*
        localStorage.setItem("characterManifest", this.characterManifest)
        localStorage.setItem("imageManifest", this.imageManifest)
        localStorage.setItem("mapManifest", this.mapManifest)
        */
    }

    generateCharacterAnimation(key) {
        [
            { 
                key: `${key}_walk_left`,
                texture: key,
                start: 118,
                end: 125
            },
            {
                key: `${key}_walk_right`,
                texture: key,
                start: 144,
                end: 151
            },
            {
                key: `${key}_walk_down`,
                texture: key,
                start: 131,
                end: 138,
            },
            {
                key: `${key}_walk_up`,
                texture: key,
                start: 105,
                end: 112,
            },
            { 
                key: `${key}_idle_left`,
                texture: key,
                start: 117,
                end: 117
            },
            {
                key: `${key}_idle_right`,
                texture: key,
                start: 143,
                end: 143,
            },
            {
                key: `${key}_idle_down`,
                texture: key,
                start: 131,
                end: 131,
            },
            {
                key: `${key}_idle_up`,
                texture: key,
                start: 105,
                end: 105,
            }
        ].map(({key, texture, start, end}) => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNames(texture, { start, end, first: start }),
                repeat: -1,
                frameRate: 14
            })
        })
    }
}

export default BootScene
