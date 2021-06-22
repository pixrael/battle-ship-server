import { Coordinate } from './battle'
import { Ship, SHIP_ORIENTATION, SHIP_TYPE } from './ship'
import * as Random from '../../utils/random'
import { preConfig10x10Board_1 } from '../../test/models/preconfig-boards/preconfig-boards'

export enum BOARD_CELL {
    S4L_PART = 4, //cell with a part of a S4L never hit
    S3L_PART = 3, //cell with a part of a S3L never hit
    S2L_PART = 2, //cell with a part of a S2L never hit
    S1L_PART = 1, //cell with a part of a S1L never hit
    S4L_HIT = -4, //cell with a part of a S4L already hit, but the ship is not destroyed yet
    S3L_HIT = -3, //cell with a part of a S3L already hit, but the ship is not destroyed yet
    S2L_HIT = -2, //cell with a part of a S2L already hit, but the ship is not destroyed yet
    S1L_HIT = -1, //cell with a part of a S1L already hit, but the ship is not destroyed yet
    S4L_DES = -40, //cell with a part of a S4L already destroyed
    S3L_DES = -30, //cell with a part of a S3L already destroyed
    S2L_DES = -20, //cell with a part of a S2L already destroyed
    S1L_DES = -10, //cell with a part of a S1L already destroyed
    SEA = 0, //no ship and no hit yet
    MISS = -100, //no ship and no hit yet
}

type ShipPositionModel = {
    position: Coordinate
    lengthShip: number
    typeShip: SHIP_TYPE
}

export class Board {
    private width: number
    private height: number
    private ships: Ship[] = []
    private board: number[][] = []
    private clientBoard: number[][] = []
    private maxTries = 100

    constructor(width: number, height: number) {
        this.width = width
        this.height = height

        for (let i = 0; i < width; i++) {
            const row = []
            const row2 = []
            for (let j = 0; j < height; j++) {
                row.push(BOARD_CELL.SEA)
                row2.push(BOARD_CELL.SEA)
            }

            this.board.push(row)
            this.clientBoard.push(row2)
        }
    }

    getFullState() {
        return {
            width: this.width,
            height: this.height,
            board: this.board,
        }
    }

    placeShips(ships: Ship[]) {
        let nTries = 0
        for (let i = 0; i < ships.length; i++) {
            const ship = ships[i]
            let canBePlaced = false
            const marked = []

            while (!canBePlaced) {
                const { position, orientation } =
                    this.calculateRandomPositionAndOrientation(ship.getLength())

                ship.setPosition(position)
                ship.setOrientation(orientation)

                const isRepeated = this.isRepeatedCollidePosition(
                    marked,
                    ship.getPosition(),
                    ship.getOrientation()
                )

                if (isRepeated) {
                    canBePlaced = false
                    nTries++
                    if (nTries === this.maxTries) {
                        break
                    }
                } else {
                    canBePlaced = !this.isCollidingWithOtherShip(
                        ship.getPosition(),
                        ship,
                        this.board
                    )

                    if (!canBePlaced) {
                        marked.push({
                            pos: ship.getPosition(),
                            orientation: ship.getOrientation(),
                        })
                        canBePlaced = false
                        nTries++

                        if (nTries === this.maxTries) {
                            break
                        }
                    }
                }
            }

            if (canBePlaced) {
                this.placeShip(
                    ship.getPosition(),
                    ship.getLength(),
                    ship.getOrientation(),
                    ship.getType(),
                    this.board
                )
            } else {
                //At this point should load a preconfig
                this.placePreconfigShipDistribution()
                break
            }
        }
        //take first ship
        //select random orientation that is not a marked position
        //if horizontal
        //select ship.position.x between [0,this.width-ship.long]
        //if vertical
        //select ship.position.y between [0,this.height-ship.long]
        //check if in that position there is not conflict in any of the parts of the ship with other ship
        //if there is conflict then, mark that position and start the process from the begining
        //if there is not conflict then place the ship there and continue with the next one and clear the marked positions
        //if there is the 10 startover the select a preconfigured ship placements
    }

    getBoard() {
        return this.board
    }

    setMaxTries(maxTries: number) {
        this.maxTries = maxTries
    }

    getClientBoard() {
        return this.clientBoard
    }

    private calculateRandomPositionAndOrientation(shipLength: number) {
        let orientation = SHIP_ORIENTATION.HORIZONTAL
        if (Random.randomBetween(0, 1)) orientation = SHIP_ORIENTATION.VERTICAL

        let limitRandomX = this.width - shipLength
        let limitRandomY = this.height

        if (orientation === SHIP_ORIENTATION.VERTICAL) {
            limitRandomX = this.width
            limitRandomY = this.height - shipLength
        }

        const r = Random.randomBetween(0, limitRandomX)
        const c = Random.randomBetween(0, limitRandomY)
        return { orientation, position: { r, c } }
    }

    private isRepeatedCollidePosition(
        marked: {
            pos: Coordinate
            orientation: SHIP_ORIENTATION
        }[],
        pos: Coordinate,
        orientation: SHIP_ORIENTATION
    ) {
        return marked.some(
            (mark) =>
                mark.orientation === orientation &&
                mark.pos.r === pos.r &&
                mark.pos.c === pos.c
        )
    }

    private isInsideBoardLimits(
        pos: number,
        shipLong: number,
        orientation: SHIP_ORIENTATION,
        widthBoard: number,
        heightBoard: number
    ) {
        let boardWH = heightBoard
        if (orientation === SHIP_ORIENTATION.HORIZONTAL) {
            boardWH = widthBoard
        }

        return pos >= 0 && pos <= boardWH - shipLong
    }

    private isCollidingWithOtherShip(
        position: Coordinate,
        ship: Ship,
        board: number[][]
    ) {
        const shipLength = ship.getLength()

        let collides = false
        for (let i = 0; i < shipLength; i++) {
            let realPos

            if (ship.getOrientation() === SHIP_ORIENTATION.VERTICAL) {
                realPos = position.r + i
                collides = board[realPos][position.c] !== BOARD_CELL.SEA
            } else {
                realPos = position.c + i
                collides = board[position.r][realPos] !== BOARD_CELL.SEA
            }

            if (collides) break
        }

        return collides
    }

    private placeShip(
        position: Coordinate,
        shipLength: number,
        shipOrientation: SHIP_ORIENTATION,
        shipType: SHIP_TYPE,
        board: number[][]
    ) {
        for (let i = 0; i < shipLength; i++) {
            let realPos

            if (shipOrientation === SHIP_ORIENTATION.VERTICAL) {
                realPos = position.r + i
                board[realPos][position.c] =
                    this.getBoardCellFromShipPart(shipType)
            } else {
                realPos = position.c + i
                board[position.r][realPos] =
                    this.getBoardCellFromShipPart(shipType)
            }
        }
    }

    private placePreconfigShipDistribution() {
        for (let i = 0; i < preConfig10x10Board_1.length; i++) {
            for (let j = 0; j < preConfig10x10Board_1[0].length; j++) {
                this.board[i][j] = preConfig10x10Board_1[i][j]
            }
        }
    }

    private getBoardCellFromShipPart(type: SHIP_TYPE) {
        if (type === SHIP_TYPE.S4L) return BOARD_CELL.S4L_PART
        if (type === SHIP_TYPE.S3L) return BOARD_CELL.S3L_PART
        if (type === SHIP_TYPE.S2L) return BOARD_CELL.S2L_PART
        if (type === SHIP_TYPE.S1L) return BOARD_CELL.S1L_PART
    }
}
