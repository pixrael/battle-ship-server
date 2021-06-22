import { Battle, BATTLE_MODES } from '../src/models/battle'

const socketio = require('socket.io')

let battle

function initSocket(server, origin) {
    const io = socketio(server, {
        cors: {
            origin, //TODO: depends on the environment
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        console.log('connected !!!')

        socket.on('join-battle', ({ battleId }) => {
            battle = new Battle(battleId, BATTLE_MODES.EASY)
            battle.setInitalRandomShipPositions()
            const initialState = battle.getClientState()
            socket.emit('joined', initialState)
        })
    })
}

module.exports = {
    initSocket,
}
