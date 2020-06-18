import * as broadcast from './broadcast'
import * as emit from './emit'

/**
 * 
 * @param {string} eventName 
 * @param {socket.io} connection
 * @return {Number}
 */
export function eventEmit( eventName, connection ) {
    try {
        const location = Object.keys(emit).indexOf(eventName)
        if( Object.keys(emit).indexOf(eventName) ) {
            return connection.emit(eventName, emit[location])
        }
    } catch(e) {
        throw new Error(`Emit event ${eventName} does not exist.`)
    }
}

/**
 * 
 * @param {String} eventName 
 * @param {socket.io/Connection} connection
 * @return {Number}
 */
export function eventBroadcast( eventName, connection ) {
    try {
        const location = Object.keys(broadcast).indexOf(eventName)
        if( Object.keys(broadcast).indexOf(eventName) ) {
            return connection.emit(eventName, broadcast[location])
        }
    } catch(e) {
        throw new Error(`Emit event ${eventName} does not exist.`)
    }
}