import { v4 as uuidv4 } from 'uuid'
import { Battle, BATTLE_MODES } from './battle'
import { SHIP_STATUS } from './ship'

class Game {
    private id: string
    private battle: Battle
    private socket
    constructor(id: string, mode: BATTLE_MODES, nMaxAttemps: number) {
        this.id = id
        if (mode !== BATTLE_MODES.CUSTOM) this.battle = new Battle(id, mode)
        else this.battle = new Battle(id, mode, nMaxAttemps)

        this.battle.setInitalRandomShipPositions()
    }

    getGameId() {
        return this.id
    }

    getBattleClientState() {
        return this.battle.getClientState()
    }

    getBattleFullState() {
        return this.battle.getFullState()
    }

    shot(row: number, column: number) {
        this.battle.shot(row, column)
    }

    getShipDataClient() {
        return this.battle.getShips().map((ship) => ({
            type: ship.getType(),
            destroyed: ship.getStatus() === SHIP_STATUS.DESTROYED,
        }))
    }

    getNAttempsData() {
        return {
            nMaxAttemps: this.battle.getNMaxAttemps(),
            nAttemps: this.battle.getNAttemps(),
            infinite: this.battle.getMode() === BATTLE_MODES.EASY,
        }
    }

    setSocket(socket) {
        this.socket = socket
    }

    getSocket() {
        return this.socket
    }
}

export default class GamesServer {
    private games: Game[] = []

    createNewGame(mode: BATTLE_MODES, nMaxAttemps: number) {
        const uuid = uuidv4()
        const game = new Game(uuid, mode, nMaxAttemps)
        this.games.push(game)

        return game
    }

    getGameById(id: string) {
        return this.games.find((game) => game.getGameId() === id)
    }

    getGameBySocket(socket: Socket) {
        return this.games.find((game) => game.getSocket() === socket)
    }

    removeGame(game: Game) {
        const i = this.games.indexOf(game)
        this.games.splice(i, 1)
    }

    getGames() {
        return this.games
    }
}
