import GamesServer from '../src/models/games-server'
import { boardConsoleLogger } from './board-logger'

const socketio = require('socket.io')

function initSocket(server, origin, gameServer: GamesServer) {
    const io = socketio(server, {
        cors: {
            origin, // TODO: depends on the environment
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
                game.addNewPlayer(socket)

                const state = game.getBattleClientState()
                const shipsData = game.getShipDataClient()
                const nAttempsData = game.getNAttempsData()

                game.getPlayers().forEach((s) =>
                    s.emit('joined', { ...state, shipsData, nAttempsData })
                )
            }
        })

        socket.on('shot', ({ battleId, row, column }) => {
            const game = gameServer.getGameById(battleId)
            game.shot(row, column)
            const state = game.getBattleClientState()
            boardConsoleLogger(game.getBattleFullState().board)
            const shipsData = game.getShipDataClient()
            const nAttempsData = game.getNAttempsData()

            game.getPlayers().forEach((s) =>
                s.emit('current-state', { ...state, shipsData, nAttempsData })
            )
        })

        socket.on('exit-battle', ({ battleId }) => {
            const game = gameServer.getGameById(battleId)
            gameServer.removeGame(game)
        })

        socket.on('disconnect', () => {
            const game = gameServer.getGameBySocket(socket)
            if (!game) return
            game.removePlayer(socket)
            if (!game.getPlayers().length) {
                gameServer.removeGame(game)
            }
        })
    })
}

module.exports = {
    initSocket,
}
