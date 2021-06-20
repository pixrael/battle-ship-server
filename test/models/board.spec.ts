import { assert } from 'chai'
import * as sinon from 'sinon'
import { Board } from '../../src/models/board'
import { boardLogger } from '../../utils/board-logger'
import { init10x10Board } from '../models/preconfig-boards/preconfig-boards'
import * as Random from '../../utils/random'

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
        it('Should place some ships', () => {
            const testFunc = () => 7
            const obj = { testFunc }

            const testFunc2 = () => 10

            const board = new Board(10, 10)
            sinon
                .stub(Random, 'randomBetween')
                .onCall(0)
                .returns(50)
                .onCall(1)
                .returns(60)
                .onCall(2)
                .returns(70)
            board.testFunc()
            board.testFunc()
            board.testFunc()

            assert.equal(Random.randomBetween(1, 2), 10)
        })
    })
})
