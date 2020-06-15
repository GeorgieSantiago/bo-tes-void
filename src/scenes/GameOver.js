import Scene from './Scene'

class GameOverScene extends Scene {
    constructor(test) {
        super({
            key: 'GameOverScene',
            tile: ""
        });
    }
    
    preload() {

    }

    create() {
        /**
         * Load music
         */
        this.music = this.game.sound.add('night_on_the_street');
        this.music.play();
        var title = this.add.text(this.scale.canvasBounds.centerX, this.scale.canvasBounds.centerY, "You did not survive.", {
            fontSize: '16px',
            fontStyle: '',
            backgroundColor: null,
            color: '#fff',
            stroke: '#fff',
            strokeThickness: 0,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#000',
                blur: 0,
                stroke: false,
                fill: false
            },
            align: 'left',  // 'left'|'center'|'right'|'justify'
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        });
        title.setOrigin(0.5);

        this.input.keyboard.on('keyup', this.handleKey, this);
    }

    update(time, delta) {

    }

    handleKey = key => {
        if( key.code === "Space"  ) {
            this.music.stop()
            this.scene.stop()
            this.scene.destroy("HUD")
            this.scene.restart("Sandbox")
        }
    }

    startGame() {
        this.scene.stop();
        this.scene.start('IntroScene');
    }

    restartScene() {
        this.scene.stop('IntroScene');
        this.scene.launch('IntroScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);
    }
}

export default GameOverScene;
