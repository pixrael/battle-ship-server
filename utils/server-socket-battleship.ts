import socketio from 'socket.io'
import { boardConsoleLogger } from './board-logger'
export default class ServerSocketBattleship {
    private socket
    private server
    private gameServer
    private io

    constructor(server, gameServer) {
        this.server = server
        this.socket = socketio
        this.gameServer = gameServer
    }

    setupSocket(origin) {
        this.io = this.socket(this.server, {
            cors: {
                origin, // TODO: depends on the environment
                methods: ['GET', 'POST'],
            },
        })
    }

    initSocket() {
        this.io.on('connection', (socket) => {
            socket.on('join-game', ({ battleId }) => {
                const game = this.gameServer.getGameById(battleId)

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
                console.log('shot!!!')

                const game = this.gameServer.getGameById(battleId)
                game.shot(row, column)
                const state = game.getBattleClientState()
                boardConsoleLogger(game.getBattleFullState().board)
                const shipsData = game.getShipDataClient()
                const nAttempsData = game.getNAttempsData()

                game.getPlayers().forEach((s) =>
                    s.emit('current-state', {
                        ...state,
                        shipsData,
                        nAttempsData,
                    })
                )
            })

            socket.on('exit-battle', ({ battleId }) => {
                const game = this.gameServer.getGameById(battleId)
                this.gameServer.removeGame(game)
            })

            socket.on('disconnect', () => {
                const game = this.gameServer.getGameBySocket(socket)
                if (!game) return
                game.removePlayer(socket)
                if (!game.getPlayers().length) {
                    this.gameServer.removeGame(game)
                }
            })
        })
    }
}
