import { v4 as uuidv4 } from 'uuid'
import { Battle, BATTLE_MODES } from './battle'

class Game {
    private id: string
    private battle: Battle
    constructor(id: string, mode: BATTLE_MODES, nMaxAttemps: number) {
        this.id = id
        this.battle = new Battle(id, mode, nMaxAttemps)
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
}
