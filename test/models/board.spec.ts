import { assert } from 'chai'
import * as sinon from 'sinon'
import { Board } from '../../src/models/board'
import { boardLogger } from '../../utils/board-logger'
import {
    init10x10Board,
    config110x10Board,
    config210x10Board,
    config310x10Board,
    config410x10Board,
    config510x10Board,
} from '../models/preconfig-boards/preconfig-boards'
import * as Random from '../../utils/random'
import { Ship, SHIP_TYPE } from '../../src/models/ship'

describe('Board', () => {
    describe('Creation of board', () => {
        it('Should create a board with correct width and height', () => {
            const board = new Board(10, 10)
            const expectedBoard = {
                width: 10,
                height: 10,
                board: init10x10Board,
            }

            assert.deepEqual(board.getFullState(), expectedBoard)
        })
    })

    describe('Placing ships', () => {
        var sandbox
        beforeEach(function () {
            sandbox = sinon.createSandbox()
        })

        afterEach(function () {
            sandbox.restore()
        })

        it('Should place S4L Horizontal at 0,0', () => {
            const board = new Board(10, 10)
            const ships = [new Ship(SHIP_TYPE.S4L)]

            const s = sandbox.stub(Random, 'randomBetween')
            let nCalls = { count: 0 }
            setRandomBetweenCalls2(s, 0, { r: 0, c: 0 }, nCalls)

            board.placeShips(ships)

            boardLogger(board.getBoard(), './logs/boardResult.txt')

            assert.deepEqual(board.getBoard(), config110x10Board)
        })

        it('Should place S4L Vertical at 0,0', () => {
            const board = new Board(10, 10)
            const ships = [new Ship(SHIP_TYPE.S4L)]

            const s = sandbox.stub(Random, 'randomBetween')
            let nCalls = { count: 0 }
            setRandomBetweenCalls2(s, 1, { r: 0, c: 0 }, nCalls)

            board.placeShips(ships)

            boardLogger(board.getBoard(), './logs/boardResult.txt')

            assert.deepEqual(board.getBoard(), config210x10Board)
        })

        it('Should place S3L horizontal at 0,0', () => {
            const board = new Board(10, 10)
            const ships = [new Ship(SHIP_TYPE.S3L)]

            const s = sandbox.stub(Random, 'randomBetween')
            let nCalls = { count: 0 }
            setRandomBetweenCalls2(s, 0, { r: 6, c: 3 }, nCalls)

            board.placeShips(ships)

            boardLogger(board.getBoard(), './logs/boardResult.txt')

            assert.deepEqual(board.getBoard(), config310x10Board)
        })

        it('should place 3 ships ', () => {
            const board = new Board(10, 10)
            const ships = [
                new Ship(SHIP_TYPE.S4L),
                new Ship(SHIP_TYPE.S3L),
                new Ship(SHIP_TYPE.S2L),
            ]

            let nCalls = { count: 0 }
            const s = sandbox.stub(Random, 'randomBetween')
            setRandomBetweenCalls2(s, 0, { r: 1, c: 3 }, nCalls)
            setRandomBetweenCalls2(s, 1, { r: 4, c: 5 }, nCalls)
            setRandomBetweenCalls2(s, 0, { r: 6, c: 3 }, nCalls)

            board.placeShips(ships)

            boardLogger(board.getBoard(), './logs/boardResult.txt')

            assert.deepEqual(board.getBoard(), config410x10Board)
        })

        it('should place 4 ships and fourth should collide', () => {
            const board = new Board(10, 10)
            const ships = [
                new Ship(SHIP_TYPE.S4L),
                new Ship(SHIP_TYPE.S3L),
                new Ship(SHIP_TYPE.S2L),
                new Ship(SHIP_TYPE.S2L),
            ]

            let nCalls = { count: 0 }
            const s = sandbox.stub(Random, 'randomBetween')
            setRandomBetweenCalls2(s, 0, { r: 1, c: 3 }, nCalls) //orientation, row and col
            setRandomBetweenCalls2(s, 1, { r: 4, c: 5 }, nCalls) //orientation, row and col
            setRandomBetweenCalls2(s, 0, { r: 6, c: 3 }, nCalls) //orientation, row and col
            setRandomBetweenCalls2(s, 1, { r: 5, c: 4 }, nCalls) //COLLISION orientation, row and col
            setRandomBetweenCalls(s, { r: 8, c: 9 }, nCalls) //only row and col

            board.placeShips(ships)

            boardLogger(board.getBoard(), './logs/boardResult.txt')

            assert.deepEqual(board.getBoard(), config510x10Board)
        })

        const setRandomBetweenCalls = (stub, pos, nCalls) => {
            const call0 = nCalls.count
            const call1 = nCalls.count + 1
            nCalls.count = call1 + 1

            stub.onCall(call0)
                .returns(pos.r) //random to select row,
                .onCall(call1)
                .returns(pos.c) //random to select col,
        }

        const setRandomBetweenCalls2 = (stub, orientation, pos, nCalls) => {
            const call0 = nCalls.count
            const call1 = nCalls.count + 1
            const call2 = nCalls.count + 2
            nCalls.count = call2 + 1

            stub.onCall(call0)
                .returns(orientation) //random to select ship orientation, 0 ->horizontal
                .onCall(call1)
                .returns(pos.r) //random to select row,
                .onCall(call2)
                .returns(pos.c) //random to select col,
        }
    })
})
