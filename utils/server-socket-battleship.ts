import http from 'http'
import socketio from 'socket.io'
import GamesServer from '../src/models/games-server'
import { boardConsoleLogger } from './board-logger'
export default class ServerSocketBattleship {
    private socket
    private server: http.Server
    private gamesServer: GamesServer
    private io: socketio.Server

    constructor(server: http.Server, gamesServer: GamesServer) {
        this.server = server
        this.socket = socketio
        this.gamesServer = gamesServer
    }

    setupSocket(origin: string) {
        this.io = this.socket(this.server, {
            cors: {
                origin, // TODO: depends on the environment
                methods: ['GET', 'POST'],
            },
        })
    }

    initSocket() {
        this.io.on('connection', (socket: socketio.Socket) => {
            socket.on('join-game', ({ battleId }) => {
                const game = this.gamesServer.getGameById(battleId)

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

                const game = this.gamesServer.getGameById(battleId)
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
                const game = this.gamesServer.getGameById(battleId)
                this.gamesServer.removeGame(game)
            })

            socket.on('disconnect', () => {
                const game = this.gamesServer.getGameBySocket(socket)
                if (!game) return
                game.removePlayer(socket)
                if (!game.getPlayers().length) {
                    this.gamesServer.removeGame(game)
                }
            })
        })
    }
}
