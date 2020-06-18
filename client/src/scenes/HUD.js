import Phaser from 'phaser'

class HUD extends Phaser.Scene {

    constructor (scene, soundtrack)
    {
        super({ key: 'HUD', active: true, scene, soundtrack });
        this.sanity = 70
        this.soundtrack = soundtrack
        this.activeScene = scene.scene
        this.inventoryOpen = false
        this.selectedItem = null
        this.selectedPanel = 0
        this.itemDescriptions = require("../manifest/items-description.json")
        
    }

    create ()
    {
        const { socket } = this.activeScene.scene
        let { height } = this.sys.game.config
        this.activeScene.scene.cameras.main.setBounds(0, 0, 1028, 1028);
        this.activeScene.scene.physics.world.setBounds(0, 0, 1028, 1028);
        /**
         * Sound effects and atmosphere
         */
        this.scene.s50 = this.game.sound.add('s50');
        this.scene.s30 = this.game.sound.add('Ambience_Hell_02')
        this.scene.s0 = this.game.sound.add('record')
        this.scene.sinventory = this.game.sound.add('inventory_open')
        this.scene.finventory = this.game.sound.add('action-openbook01')
        //Create UI Dialog box
        this.dialog = this.createTextBox(5, height - 100, { fixedHeight: height / 12 })
        /**
         * Sanity
         */
        const Random = Phaser.Math.Between;
        const { scene } = this.scene
        this.add.text(0, 0, 'Sanity', { fontFamily: '"Roboto Condensed"' });        
        this.sbContainer = this.add.rectangle(10, 45, 200, 15, 0xff0000)
        this.sbBar = this.add.rectangle(10, 45, this.sanity, 15, 0x65ff00)

        /**
         * Socket Event Listeners
         */
        socket.on('planet_info', planet => {
        /**
         * Character Select
         */
        const characterMenu = scene.rexUI.add.tabs({
            x: 400,
            y: 300,

            background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 0, 0x333333),

            panel: scene.rexUI.add.gridTable({
                 x: 0,
                 y: 0,
                // anchor: undefined,
                // width: undefined,
                // height: undefined,
            
                scrollMode: 0,
            
                // Elements
                background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x283593),
            
                table: {
                    width: 600,
                    height: 400,
            
                    cellWidth: 600,
                    cellHeight: 80,
                    columns: 1,
                    mask: {
                        padding: 0
                    },
                    interactive: true,
                    reuseCellContainer: false,
                },
                slider: {
                    track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x260e04),
                    thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x7b5e57),
                },
            
                scroller: {
                    threshold: 10,
                    slidingDeceleration: 5000,
                    backDeceleration: 2000,
                },
            
                clamplChildOY: false,
            
                header: scene.rexUI.add.label({
                    width: undefined,
                    height: 30,
                    orientation: 0,
                    background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, 0x260e04),
                    text: this.add.text(0, 0, 'Select a unit to deploy'),
                }),
                footer: this.getFooterSizerSelect(this, 0, [() => {
                    characterMenu.visible = false
                    socket.emit('player_deploy', planet.units[this.selectedCharacter])
                }, 
                () => {
                    console.log("player_spectate")
                    socket.emit('player_spectate')
                }]),
            
                space: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
        
                    table: 0,
                    header: 0,
                    footer: 0,
                },
            
                expand: {
                    header: true,
                    footer: true,
                },
            
                align: {
                    header: 'center',
                    footer: 'center',
                },
            
                createCellContainerCallback: function(cell, cellContainer) {
                    const { scene, width, height, item } = cell
                    
                    if (cellContainer === null) {
                        cellContainer = scene.rexUI.add.sizer({
                            orientation: 1,

                            // x: 0,
                            // y: 0,
                            // anchor: undefined,
                            // width: undefined,
                            // height: undefined,
                            // space: { left: 0, right:0, top:0, bottom:0 }
                        })

                                            //Character Select configuration
                    cellContainer.add(scene.rexUI.add.label({
                        width: width,
                        orientation: 0,
                        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x333333),
                        text: scene.add.text(0, 0, ''),

                        space: {
                            icon: 10,
                            left: 15,
                            top: 0,
                        }
                    }))

                                        //Character Select configuration
                    cellContainer.add(scene.rexUI.add.label({
                        width: width,
                        orientation: 0,
                        text: scene.add.text(0, 0, ''),

                        space: {
                            left: 15,
                            top: 0,
                        }
                    }))

                                        //Character Select configuration
                    cellContainer.add(scene.rexUI.add.label({
                        width: width,
                        orientation: 0,
                        text: scene.add.text(0, 0, ''),

                        space: {
                            left: 15,
                            top: 0,
                        }
                    }))

                    cellContainer.add(scene.rexUI.add.label({
                        width: width,
                        orientation: 0,
                        text: scene.add.text(0, 0, ''),

                        space: {
                            left: 15,
                            top: 0,
                        }
                    }))

                }

                    const labels = cellContainer.children
                    labels[0].setText(`Name: ${item.name}`)//.getElement('background').setStrokeStyle(2, 0x260e04).setDepth(0)
                    labels[1].setText(`Age: ${item.age}`)//.getElement('background').setStrokeStyle(2, 0x260e04).setDepth(0)
                    labels[2].setText(`Role: ${item.job}`)//.getElement('background').setStrokeStyle(2, 0x260e04).setDepth(0)
                    labels[3].setText(`Gender: ${item.gender}`)//.getElement('background').setStrokeStyle(2, 0x260e04).setDepth(0)
                    cellContainer.setMinSize(width, height); // Size might changed in this demo
                    cellContainer.layout()
                    return cellContainer;
                },
            
                items: planet.units,
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                leftButtonsOffset: 20,
                rightButtonsOffset: 20,
                topButtonsOffset: 20,
                bottomButtonsOffset: 20,

                leftButton: 10,
                rightButton: 10,
                topButton: 10,
                bottomButton: 10
            }
        })
        .layout()

        characterMenu.getElement('panel').on('cell.1tap', (cellContainer, cellIndex) => {
            if( this.selectedCharacter ) {
                //characterMenu.getElement("table").setStrokeStyle(2, 0xffffff)
                characterMenu
                    .getElement('panel')
                    .getElement('table')
                    .getCell(this.selectedCharacter)
                    .fillColorr = 0x333333
            }
            this.selectedCharacter = cellIndex
            cellContainer.children[0].getElement('icon').fillColor = 0xffffff
            /*if( this.selectedCharacter ) {
                cellContainer.getElement('background').setStrokeStyle(2, 0x260e04)
                this.selectedCharacter = cellIndex
            }*/
        })
        
        if(planet.playerCount === 0) {
            characterMenu.getElement("footer").children[1].disableInteractive()
        }


        this.characterSelect = characterMenu
        this.characterSelect.visible = this.activeScene.player ? false : true


        /**
         * Menu
         */
        const menu = scene.rexUI.add.tabs({
            x: 400,
            y: 300,

            background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 0, 0x333333),

            panel: scene.rexUI.add.gridTable({
                 x: 0,
                 y: 0,
                // anchor: undefined,
                // width: undefined,
                // height: undefined,
            
                scrollMode: 0,
            
                // Elements
                background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x283593),
            
                table: {
                    width: 400,
                    height: 400,
            
                    cellWidth: 400,
                    cellHeight: 60,
                    columns: 1,
                    mask: {
                        padding: 0
                    },
                    interactive: true,
                    reuseCellContainer: false,
                },
            
                slider: {
                    track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x260e04),
                    thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x7b5e57),
                },
            
                scroller: {
                    threshold: 10,
                    slidingDeceleration: 5000,
                    backDeceleration: 2000,
                },
            
                clamplChildOY: false,
            
                header: scene.rexUI.add.label({
                    width: undefined,
                    height: 30,
                    orientation: 0,
                    background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, 0x260e04),
                    text: this.add.text(0, 0, ''),
                }),
                footer: this.getFooterSizer(this, 0),
            
                space: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
            
                    table: 0,
                    // table: {
                    //    top: 0,
                    //    bottom: 0,
                    //    left: 0,
                    //    right: 0,
                    //},
                    header: 0,
                    footer: 0,
                },
            
                expand: {
                    header: true,
                    footer: true,
                },
            
                align: {
                    header: 'center',
                    footer: 'center',
                },
            
                createCellContainerCallback: function(cell, cellContainer) {
                    const { scene, width, height, item: { key, items } } = cell

                    if (cellContainer === null) {
                        cellContainer = scene.rexUI.add.label({
                            width: width,
                            height: height,
    
                            orientation: 0,
                            background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, 0x260e04),
                            icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                            text: scene.add.text(0, 0, ''),
    
                            space: {
                                icon: 10,
                                left: 15,
                                top: 0,
                            }
                        });
                    }
                    //Inventory configuration
                    if( key === 0 ) {
                                      // Set properties from item value
                                      cellContainer.setMinSize(width, height); // Size might changed in this demo
                                      cellContainer.getElement('text').setText(item.label.replace(/\_/g, " ")); // Set text of text object
                                      //@TODO fill with sprite
                                      //cellContainer.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
                                      cellContainer.getElement('background').setStrokeStyle(2, 0x260e04).setDepth(0);
                    }
                    
                    //Crewmen
                    if( key === 1 ) {

                    }

                    //Planet data
                    if( key === 2 ) {

                    }
                    return cellContainer;
                },
            
                items: [],
            
                // name: '',
                // draggable: false
            }),

            leftButtons: [
                scene.rexUI.add.label({
                    width: 100,
                    height:40,
                    background: scene.rexUI.add.roundRectangle(0, 0, 100, 50, {
                        tl: 25,
                        bl: 25
                    }, Random(0, 0xffffff)),
                    text: scene.add.text(0, 0, "Inventory", {
                        fontSize: '18pt'
                    }),
                    space: {
                        left: 10
                    }
                }),
                scene.rexUI.add.label({
                    width: 100,
                    height:40,
                    background: scene.rexUI.add.roundRectangle(0, 0, 100, 50, {
                        tl: 25,
                        bl: 25
                    }, Random(0, 0xffffff)),
                    text: scene.add.text(0, 0, "Team", {
                        fontSize: '18pt'
                    }),
                    space: {
                        left: 10
                    }
                }),
                scene.rexUI.add.label({
                    width: 100,
                    height:40,
                    background: scene.rexUI.add.roundRectangle(0, 0, 100, 50, {
                        tl: 25,
                        bl: 25
                    }, Random(0, 0xffffff)),
                    text: scene.add.text(0, 0, "Research", {
                        fontSize: '18pt'
                    }),
                    space: {
                        left: 10
                    }
                }),
            ],
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                leftButtonsOffset: 20,
                rightButtonsOffset: 20,
                topButtonsOffset: 20,
                bottomButtonsOffset: 20,

                leftButton: 10,
                rightButton: 10,
                topButton: 10,
                bottomButton: 10
            }
        })
        .layout()

        menu.getElement('panel')
        .on('cell.over', function (cellContainer, cellIndex) {
            cellContainer.getElement('background')
                .setStrokeStyle(2, 0x7b5e57)
                .setDepth(1);
        }, this)
        .on('cell.out', function (cellContainer, cellIndex) {
            cellContainer.getElement('background')
                .setStrokeStyle(2, 0x260e04)
                .setDepth(0);
        }, this)
/*        .on('cell.1tap', function (cellContainer, cellIndex) {
            this.selectedItem = this.getInventoryItems(this.selectedPanel)[cellIndex].label
            if( this.selectedPanel === 0 ) {
            menu.getElement('panel').getElement('footer').children.map(btn => {
                btn.alpha = 1
                btn.setInteractive()
            })
            } else {
                const examine = menu.getElement('panel').getElement('footer').children[1]
                examine.alpha = 1
                examine.setInteractive()
            }
            //@TODO Highlight the item

        }, this)*/

        const getIndexData = index => {
            switch(index) {
                case 0 :
                    return []
                break
                case 1 : 
                    return this.scene.teamPlayers
                case 2 : 
                    return planet
            }
        }

        menu
        .on('button.click', function (button, groupName, index) {
            menu.getElement('panel').getElement('background').setFillStyle(button.backgroundChildren[0].fillColor);
            menu.getElement('panel').setItems(planet[getIndexData(index)])
            this.selectedPanel = index
            menu.getElement('panel').getElement('footer').children.map(btn => {
                btn.alpha = 0.5
                btn.disableInteractive()
            })

            this.selectedItem = null
            this.scene.finventory.play()
        }, this)
        
            menu.visible = false
            this.menu = menu

        /**
         * Scene Event Listeners
         */
        if ( scene.events ) {
            console.log("Events set")
            this.events.on('toggle_inventory', () => {
                this.scene.sinventory.play()
                this.menu.visible = !this.menu.visible
            }, this)
            
            this.events.on('toggle_character_select', () => {
                console.log("Whats up?", this.characterSelect)
                this.scene.sinventory.play()
                this.characterSelect.visible = !this.characterSelect.visible
            }, this)
            
            this.events.on('add_sanity', () => {
                if( this.sanity < 100 ) {
                    scene.tweens.add({
                        targets: this.sbBar,
                        width: this.sanity =+ 0.1,
                        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                        duration: 1000,
                        repeat: 0,            // -1: infinity
                        yoyo: false
                    })
                }
            },this);
        }
        })
    }
  
  update(time, detla) {

  }

  parsePercent = (newValue) => {
        if(newValue < 0) newValue = 0;
        if(newValue > 100) newValue = 100;
      
        return (newValue * 200) / 100;
  }

  showDialog = content => {
      if( this.dialog.text === content || this.dialog.isTyping ) {
          this.closeDialog()
          return
      }
      this.dialog.start(content, 50)
      this.dialog.visible = true
  }

  closeDialog = () => {
      this.dialog.text = ""
      this.dialog.stop()
      this.dialog.visible = false
  }

  createTextBox = function (x, y, config) {
    const { scene } = this.scene
    const getValue = Phaser.Utils.Objects.GetValue;
    let { displayWidth } = this.scene.scene.cameras.main
    var wrapWidth = getValue(config, 'wrapWidth', displayWidth - 100);
    var fixedWidth = getValue(config, 'fixedWidth', displayWidth - 100);
    var fixedHeight = getValue(config, 'fixedHeight', 0);
    const COLOR_PRIMARY = 0x4e342e;
    const COLOR_LIGHT = 0x7b5e57;
    const COLOR_DARK = 0x260e04;
    const textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,
            minWidth: scene.width,
            width: scene.width,
            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),
            text: this.getBBcodeText(wrapWidth, fixedWidth, fixedHeight, ""),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        })
        .setOrigin(0)
        .layout();

    textBox.visible = false
    return textBox;
}

    getBBcodeText = function (wrapWidth, fixedWidth, fixedHeight, content) {
    const { scene } = this.scene
    return scene.rexUI.add.BBCodeText(0, 0, content, {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
    }

    toggleInventory = () => this.events.emit('toggle_inventory')
    toggleCharacterSelect = () => this.events.emit('toggle_character_select')
    fullScreen = () => this.scale.toggleFullscreen()

getFooterSizer = function (scene, orientation) {
    return scene.rexUI.add.sizer({
        orientation: orientation
    })
        .add(
            this.createFooterButton(scene, 'Use', orientation),   // child
            1,         // proportion
            'center'   // align
        )
        .add(
            this.createFooterButton(scene, 'Examine', orientation),    // child
            1,         // proportion
            'center'   // align
        )
}

getFooterSizerSelect = function (scene, orientation, callback) {
    return scene.rexUI.add.sizer({
        orientation: orientation
    })
    .add(
        this.createFooterButton(scene, 'Deploy', orientation, callback[0]),   // child
        1,         // proportion
        'center'   // align
    )
    .add(
        this.createFooterButton(scene, 'Spectate', orientation, callback[1]),    // child
        1,         // proportion
        'center'   // align
    )
}

 createFooterButton = function (scene, text, orientation, pointerDown= () => {}) {
    return scene.rexUI.add.label({
        height: (orientation === 0) ? 40 : undefined,
        width: (orientation === 0) ? undefined : 40,
        orientation: orientation,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x260e04),
        text: scene.add.text(0, 0, text),
        icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x7b5e57),
        align: 'center',
        space: {           
            icon: 10
        }
    })
        .setInteractive()
        .on('pointerdown', () => pointerDown(), this)
        .on('pointerover', function(){
            this.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('pointerout', function(){
            this.getElement('background').setStrokeStyle();
        })  
    }
    

    getItems = (index) => {
        const { getStorageObject } = window.tbd
        return { key: index, items: this.getCollection(index, getStorageObject()) }
    }

    getCollection = (index, collection) => {
        if(index === 0) {
            return collection.inventory.map(({label, qty}) => ({
                label,
                qty
            }))
        }

        if(index === 1) {
            return collection.crew.map(mate => mate)
        }

        if(index === 2) {
            return collection.planet
        }
    }
    

    /**
     * Use selected item
     */
    useItem = () => {
        const { removeInventoryFromStorage } = window.tbd
        const itemState = this.itemDescriptions.files.filter(item => item.label === this.selectedItem)[0]
        if( itemState.canUse ) {
            this.sanity = this.sanity + itemState.sanity
        }
        removeInventoryFromStorage(itemState.label, this.getLabel(this.selectedPanel))
        this.menu.getElement('panel').setItems(this.getInventoryItems(this.selectedPanel))
    }

    /**
     * Examine Selected item
     */
    examineItem = () => {
        const itemState = this.itemDescriptions.files.filter(item => item.label === this.selectedItem)[0]
    } 
}

export default HUD