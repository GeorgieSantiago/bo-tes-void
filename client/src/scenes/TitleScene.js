import Scene from './Scene'

class TitleScene extends Scene {
    constructor(test) {
        super({
            key: 'TitleScene',
            tile: ""
        });
    }

    init(data) {
        this.socket = data.socket
        this.connection = data.connection
    }
    
    preload() {

    }

    create() {
        /**
         * Load music
         */
        this.add.image(0, 0, 'titlebg').setOrigin(0).setScale(8);
        this.music = this.game.sound.add('the_ninth_crewman');
        this.music.play();
        var title = this.add.text(this.sys.canvas.height / 2, this.sys.canvas.width / 2, "The Bar Door");
        title.setOrigin(0.5);

        this.input.keyboard.on('keyup', this.handleKey, this);
    }

    update(time, delta) {

    }

    handleKey = key => {
        if( key.code === "Space"  ) {
            this.music.stop()
            this.scene.start("Sandbox", { socket: this.socket, connection: this.connection })
        }
    }

    startGame() {
        this.scene.stop('IntroScene');
        this.scene.start('IntroScene');
    }

    restartScene() {
        this.scene.stop('IntroScene');
        this.scene.launch('IntroScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);
    }
}

export default TitleScene;
