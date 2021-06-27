import { Board, BOARD_CELL } from './board'
import { SHIP_TYPE, Ship, SHIP_STATUS } from './ship'

export enum BATTLE_STATUS {
    IN_PROGRESS = 'IN_PROGRESS',
    GAME_OVER = 'GAME_OVER',
    GAME_WIN = 'GAME_WIN',
}

export enum BATTLE_MODES {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
    CUSTOM = 'CUSTOM',
}

export class Coordinate {
    r: number
    c: number
}

export class Battle {
    private battleId: string
    private mode: string
    private nMaxAttemps: number
    private nAttemps: number
    private status: BATTLE_STATUS
    private ships: Ship[] = []
    private hitValue: number
    private board: Board

    constructor(battleId: string, mode: BATTLE_MODES, nMaxAttemps?: number) {
        this.battleId = battleId
        this.status = BATTLE_STATUS.IN_PROGRESS
        this.hitValue = 1
        this.nAttemps = 0
        if (nMaxAttemps) {
            this.mode = BATTLE_MODES.CUSTOM
            this.nMaxAttemps = nMaxAttemps
        } else {
            this.mode = mode
            if (this.mode === BATTLE_MODES.EASY) {
                this.hitValue = 0
                this.nMaxAttemps = 100
            } else if (this.mode === BATTLE_MODES.MEDIUM) {
                this.nMaxAttemps = 100
            } else if (this.mode === BATTLE_MODES.HARD) {
                this.nMaxAttemps = 50
            }
        }

        this.board = new Board(10, 10)
    }

    setInitalRandomShipPositions() {
        const typesCreate = [
            SHIP_TYPE.S4L, // 4 spaces long
            SHIP_TYPE.S3L,
            SHIP_TYPE.S3L, // 3 spaces long
            SHIP_TYPE.S2L,
            SHIP_TYPE.S2L,
            SHIP_TYPE.S2L, // 2 spaces long
            SHIP_TYPE.S1L,
            SHIP_TYPE.S1L,
            SHIP_TYPE.S1L,
            SHIP_TYPE.S1L, // 1 spaces long
        ]

        this.ships = typesCreate.map((type) => new Ship(type))
        this.board.placeShips(this.ships)
    }

    getFullState() {
        return {
            battleId: this.battleId,
            mode: this.mode,
            nAttemps: this.nMaxAttemps,
            status: this.status,
            ships: this.ships,
            hitValue: this.hitValue,
            board: this.board.getBoard(),
            clientBoard: this.board.getClientBoard(),
        }
    }

    getClientState() {
        return {
            board: this.board.getClientBoard(),
            'batte-states': this.status,
        }
    }

    shot(row: number, column: number) {
        const cellBoard = this.board.getBoard()[row][column]
        if (cellBoard === BOARD_CELL.SEA) {
            this.board.setCell(row, column, BOARD_CELL.MISS)
            this.board.setClientCell(row, column, BOARD_CELL.MISS)
            this.nAttemps += this.hitValue
            if (this.nAttemps === this.nMaxAttemps) {
                // game over, cause finished number of attemps
                this.status = BATTLE_STATUS.GAME_OVER
            }
            return
        }

        const shipHit = this.getShipHit(row, column)
        shipHit.increaseNReceivedHits()
        const isShipDestroyed = shipHit.getStatus() === SHIP_STATUS.DESTROYED
        let newCell
        if (isShipDestroyed) {
            if (cellBoard === BOARD_CELL.S4L_PART) newCell = BOARD_CELL.S4L_DES
            if (cellBoard === BOARD_CELL.S3L_PART) newCell = BOARD_CELL.S3L_DES
            if (cellBoard === BOARD_CELL.S2L_PART) newCell = BOARD_CELL.S2L_DES
            if (cellBoard === BOARD_CELL.S1L_PART) newCell = BOARD_CELL.S1L_DES

            const cellParams = {
                intialPosition: shipHit.getPosition(),
                orientation: shipHit.getOrientation(),
                nCells: shipHit.getLength(),
                newValue: newCell,
            }

            this.board.setCells(cellParams)
            this.board.setClientCells(cellParams)
        } else {
            if (cellBoard === BOARD_CELL.S4L_PART) newCell = BOARD_CELL.S4L_HIT
            if (cellBoard === BOARD_CELL.S3L_PART) newCell = BOARD_CELL.S3L_HIT
            if (cellBoard === BOARD_CELL.S2L_PART) newCell = BOARD_CELL.S2L_HIT
            if (cellBoard === BOARD_CELL.S1L_PART) newCell = BOARD_CELL.S1L_HIT

            this.board.setCell(row, column, newCell)
            this.board.setClientCell(row, column, newCell)
        }

        this.nAttemps += this.hitValue

        // verify finish of the game
        if (this.ships.some((s) => s.getStatus() !== SHIP_STATUS.DESTROYED)) {
            if (this.nAttemps === this.nMaxAttemps) {
                // game over, cause finished number of attemps
                this.status = BATTLE_STATUS.GAME_OVER
            }
        } else {
            // game win, cause all ships have been destroyed
            this.status = BATTLE_STATUS.GAME_WIN
        }
    }

    getBoard() {
        return this.board
    }

    private getShipHit(row: number, column: number) {
        return this.ships.find((s) => s.isPartOfShip(row, column))
    }
}
