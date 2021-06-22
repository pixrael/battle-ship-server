import { Board, BOARD_CELL } from './board'
import { SHIP_TYPE, Ship } from './ship'

export enum BATTLE_STATUS {
    IN_PROGRESS = 'IN_PROGRESS',
    GAME_OVER = 'GAME_OVER',
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
    private nAttemps: number
    private status: string
    private ships: Ship[] = []
    private hitValue: number
    private board: Board

    constructor(battleId: string, mode: BATTLE_MODES, nAttemps?: number) {
        this.battleId = battleId
        this.status = BATTLE_STATUS.IN_PROGRESS
        this.hitValue = 1
        if (nAttemps) {
            this.mode = BATTLE_MODES.CUSTOM
            this.nAttemps = nAttemps
        } else {
            this.mode = mode
            if (this.mode === BATTLE_MODES.EASY) {
                this.hitValue = 0
                this.nAttemps = 100
            } else if (this.mode === BATTLE_MODES.MEDIUM) {
                this.nAttemps = 100
            } else if (this.mode === BATTLE_MODES.HARD) {
                this.nAttemps = 50
            }
        }
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
        this.board = new Board(10, 10)
        this.board.placeShips(this.ships)
    }

    getFullState() {
        return {
            battleId: this.battleId,
            mode: this.mode,
            nAttemps: this.nAttemps,
            status: this.status,
            ships: this.ships,
            hitValue: this.hitValue,
        }
    }

    getClientState() {
        return {
            board: this.board.getClientBoard(),
        }
    }

    shot(row: number, column: number) {
        if (this.board.getBoard()[row][column] === BOARD_CELL.SEA) {
            this.board.setCell(row, column, BOARD_CELL.MISS)
            this.board.setClientCell(row, column, BOARD_CELL.MISS)
        } else if (this.board.getBoard()[row][column] === BOARD_CELL.S4L_PART) {
            this.board.setCell(row, column, BOARD_CELL.S4L_HIT)
            this.board.setClientCell(row, column, BOARD_CELL.S4L_HIT)
        } else if (this.board.getBoard()[row][column] === BOARD_CELL.S3L_PART) {
            this.board.setCell(row, column, BOARD_CELL.S3L_HIT)
            this.board.setClientCell(row, column, BOARD_CELL.S3L_HIT)
        } else if (this.board.getBoard()[row][column] === BOARD_CELL.S2L_PART) {
            this.board.setCell(row, column, BOARD_CELL.S2L_HIT)
            this.board.setClientCell(row, column, BOARD_CELL.S2L_HIT)
        } else if (this.board.getBoard()[row][column] === BOARD_CELL.S1L_PART) {
            this.board.setCell(row, column, BOARD_CELL.S1L_DES)
            this.board.setClientCell(row, column, BOARD_CELL.S1L_DES)
        }
    }
}
