/**
 * @TODO Create helper files
 */

/**
 * 
 * @param {*} type 
 * @param {*} map 
 * @param {*} layer 
 */
//find objects in a Tiled layer that containt a property called "type" equal to a certain value
export function findObjectByType(type, map, layer) {
    var result = new Array()
    map.objects[layer].forEach(function(element){
        if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
            element.y -= map.tileHeight
            result.push(element)
        }      
    })
    return result
}