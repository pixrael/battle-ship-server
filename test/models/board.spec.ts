import { assert } from 'chai'
import { Board } from '../../src/models/board'

describe('Instancing right board', () => {
    it('Should create a board with correct width and height', () => {
        const board = new Board(10, 10)

        const expectedBoard = {
            width: 10,
            height: 10,
        }
        assert.deepEqual(board.getFullState(), expectedBoard)
    })
})
