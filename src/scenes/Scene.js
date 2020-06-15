/**
 * @package Src\Scene
 * @extends Phaser.Scene 
 */
export default class Scene extends Phaser.Scene {
    constructor({key, tile}) {
        super({key});
        this.props = {
            tile,
            freezePlayer: false,
            MAP_REGISTRY: [
                "thebar"
            ],
            scaleRatio: window.devicePixelRatio / 3
        }
        this.storageKey = "_thebardoor_gamestate"
        this.configureLocalStorage()
        window.tbd = {
            saveStorage: this.saveStorage,
            getStorageObject: this.getStorageObject,
            removeInventoryFromStorage: this.removeInventoryFromStorage
        }
    }

    update() {

    }

    pause = () => {

    }

    save = () => {
        
    }

    createState = () => {
        const properties = [
            "sanity"
        ]
        try {
            properties.forEach(prop => {
                localStorage.setItem(`state.${prop}`, null)
            })
        } catch (e) {
            console.error("Error creating state", { e })
        }
    }

    updateState = (key, value) => {
        try {
            localStorage.setItem(`state.${key}`, value)
        } catch {
            console.error("Error updating state", { e })
        }
    }

    updateProps = (key, value) => {
        this.props = {
            ...this.props,
            [key]: value
        }
    }

    /**
     * Map objects with descriptions and coords
     * @param {objects[]} arr
     * @return {objects[]}
     */
    mapInvestigatableObjects = (player, objectLayer, context) => {

        let overlapObjectsGroup = context.physics.add.staticGroup({
        
        });
        let i = 0;
        objectLayer.forEach(object => {
        let obj = overlapObjectsGroup.create(object.x, object.y, object.name);
            obj.setScale(object.width/32, object.height/32); //my tile size was 32
            obj.setOrigin(0); //the positioning was off, and B3L7 mentioned the default was 0.5
            obj.body.width = object.width; //body of the physics body
            obj.body.height = object.height;
            obj.visible = false
        });
        overlapObjectsGroup.refresh(); //physics body needs to refresh

        context.physics.add.overlap(player, overlapObjectsGroup, () => {}, null, context);
    }   

    setGroupScale = group => {
        group.children.iterate((child) => {
            child.setScale(this.props.scaleRatio);
        });
    } 

    /**
     * Create Save State
     * @return {boolean}
     */
    configureLocalStorage = () => {
        if( !localStorage.getItem(this.storageKey) ) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                id: this.generateId(),
                sandbox: {
                    crew: this.generateCrewmen(3),
                    inventory: [
                        { label: "sert1_rations", qty: "20" },
                    ],
                    planet: {
                        name: "dont know yet",
                        day: 1,
                        weather: "Hot as fuck"
                    }
                }
            }))
        }
    }

    /**
     * Generate Crewmen
     */
    generateCrewmen = count => {
        const crew = []
        for(let i = 1;i <= count;i++) {
            crew.push(
                {
                    name: `c${i}`,
                    age: Math.random(22, 33),
                    alive: true,
                    health: 100,
                    stamina: 100,
                    sanity: 100
                }
            )
        }
        return crew
    }

    /**
     * @param {object} obj
     */
    saveStorage = (obj) => localStorage.setItem(this.storageKey, JSON.stringify(obj))


    /**
     * @return {object}
     */
    getStorageObject = () => (JSON.parse(localStorage.getItem(this.storageKey))[this.sys.config.key.toLowerCase()])

    generateId = () => (`_${Math.random().toString(36).substr(2, 9)}`)
}