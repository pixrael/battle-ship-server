import GamesServer from '../src/models/games-server'
import { boardConsoleLogger } from './board-logger'

const socketio = require('socket.io')

function initSocket(server, origin, gameServer: GamesServer) {
    const io = socketio(server, {
        cors: {
            origin, //TODO: depends on the environment
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        socket.on('join-game', ({ battleId }) => {
            const game = gameServer.getGameById(battleId)

            if (!game) {
                socket.emit('not-joined', {
                    error: 'game with that id doenst exist',
                })
            } else {
                const state = game.getBattleClientState()
                socket.emit('joined', state)
            }
        })

        socket.on('shot', ({ battleId, row, column }) => {
            const game = gameServer.getGameById(battleId)
            game.shot(row, column)
            const state = game.getBattleClientState()
            boardConsoleLogger(game.getBattleFullState().board)
            socket.emit('current-state', state)
        })
    })
}

module.exports = {
    initSocket,
}
