import { assert } from 'chai'
import {
    Ship,
    SHIP_TYPE,
    SHIP_ORIENTATION,
    SHIP_STATUS,
} from '../../src/models/ship'

describe('Instancing right ship', () => {
    describe('S4L', () => {
        it('Should create a ship of type S4L horizontal', () => {
            const ship = new Ship(SHIP_TYPE.S4L)

            const expectedShip = {
                type: SHIP_TYPE.S4L,
                length: 4,
                orientation: SHIP_ORIENTATION.HORIZONTAL,
                hit: [],
                status: SHIP_STATUS.PERFECT,
            }
            assert.deepEqual(ship.getFullState(), expectedShip)
        })
    })

    describe('S3L', () => {
        it('Should create a ship of type S3L horizontal', () => {
            const ship = new Ship(SHIP_TYPE.S3L)

            const expectedShip = {
                type: SHIP_TYPE.S3L,
                length: 3,
                orientation: SHIP_ORIENTATION.HORIZONTAL,
                hit: [],
                status: SHIP_STATUS.PERFECT,
            }
            assert.deepEqual(ship.getFullState(), expectedShip)
        })
    })

    describe('S2L', () => {
        it('Should create a ship of type S2L horizontal', () => {
            const ship = new Ship(SHIP_TYPE.S2L)

            const expectedShip = {
                type: SHIP_TYPE.S2L,
                length: 2,
                orientation: SHIP_ORIENTATION.HORIZONTAL,
                hit: [],
                status: SHIP_STATUS.PERFECT,
            }
            assert.deepEqual(ship.getFullState(), expectedShip)
        })
    })

    describe('S1L', () => {
        it('Should create a ship of type S1L horizontal', () => {
            const ship = new Ship(SHIP_TYPE.S1L)

            const expectedShip = {
                type: SHIP_TYPE.S1L,
                length: 1,
                orientation: SHIP_ORIENTATION.HORIZONTAL,
                hit: [],
                status: SHIP_STATUS.PERFECT,
            }
            assert.deepEqual(ship.getFullState(), expectedShip)
        })
    })
})
