import { assert } from 'chai'
import * as sinon from 'sinon'
import { Battle, BATTLE_MODES, BATTLE_STATUS } from '../../src/models/battle'
import { SHIP_ORIENTATION, SHIP_STATUS } from '../../src/models/ship'
import { boardConsoleLogger } from '../../utils/board-logger'
import {
    init10x10Board,
    config710x10Board,
    config710x10BoardHit,
    config710x10BoardDes,
    config710x10BoardHit2,
    config710x10BoardDes2,
    config710x10BoardHit3,
    config710x10BoardDes3,
    config810x10BoardDes,
    config810x10Board,
} from './preconfig-boards/preconfig-boards'

describe('Instancing right battle', () => {
    it('Should create a battle in easy mode', () => {
        const battle = new Battle('1234', BATTLE_MODES.EASY)

        const expectedBattle = {
            battleId: '1234',
            mode: BATTLE_MODES.EASY,
            nAttemps: 100,
            status: BATTLE_STATUS.IN_PROGRESS,
            ships: [],
            hitValue: 0,
            board: init10x10Board,
            clientBoard: init10x10Board,
        }
        assert.deepEqual(battle.getFullState(), expectedBattle)
    })

    it('Should create a battle in medium mode', () => {
        const battle = new Battle('1234', BATTLE_MODES.MEDIUM)

        const expectedBattle = {
            battleId: '1234',
            mode: BATTLE_MODES.MEDIUM,
            nAttemps: 100,
            status: BATTLE_STATUS.IN_PROGRESS,
            ships: [],
            hitValue: 1,
            board: init10x10Board,
            clientBoard: init10x10Board,
        }
        assert.deepEqual(battle.getFullState(), expectedBattle)
    })

    it('Should create a battle in hard mode', () => {
        const battle = new Battle('1234', BATTLE_MODES.HARD)

        const expectedBattle = {
            battleId: '1234',
            mode: BATTLE_MODES.HARD,
            nAttemps: 50,
            status: BATTLE_STATUS.IN_PROGRESS,
            ships: [],
            hitValue: 1,
            board: init10x10Board,
            clientBoard: init10x10Board,
        }
        assert.deepEqual(battle.getFullState(), expectedBattle)
    })

    it('Should create a battle in custom mode', () => {
        const battle = new Battle('1234', BATTLE_MODES.CUSTOM, 30)

        const expectedBattle = {
            battleId: '1234',
            mode: BATTLE_MODES.CUSTOM,
            nAttemps: 30,
            status: BATTLE_STATUS.IN_PROGRESS,
            ships: [],
            hitValue: 1,
            board: init10x10Board,
            clientBoard: init10x10Board,
        }
        assert.deepEqual(battle.getFullState(), expectedBattle)
    })

    describe('User shot', () => {
        let sandbox
        let battle
        let board
        let setInitalRandomShipPositionsStub
        beforeEach(function () {
            sandbox = sinon.createSandbox()

            battle = new Battle('1234', BATTLE_MODES.CUSTOM, 30)
            board = battle.getBoard()

            setInitalRandomShipPositionsStub = sandbox.stub(
                battle,
                'setInitalRandomShipPositions'
            )
        })

        afterEach(function () {
            sandbox.restore()
        })

        it('create initial empty board', () => {
            setInitalRandomShipPositionsStub.onCall(0).callsFake(() => {
                board.placeConfigShipDistribution(config710x10Board)
            })
            const expectedBattle = {
                battleId: '1234',
                mode: BATTLE_MODES.CUSTOM,
                nAttemps: 30,
                status: BATTLE_STATUS.IN_PROGRESS,
                ships: [],
                hitValue: 1,
                board: config710x10Board,
                clientBoard: init10x10Board,
            }
            battle.setInitalRandomShipPositions()
            assert.deepEqual(battle.getFullState(), expectedBattle)
        })

        it('Should allow the user to destroy horizontal S3L', () => {
            setInitalRandomShipPositionsStub.onCall(0).callsFake(() => {
                board.placeConfigShipDistribution(config710x10Board)
            })
            battle.setInitalRandomShipPositions()

            const getShipStub = sandbox.stub(battle, 'getShipHit')

            const mockShipHit = {
                getOrientation: () => SHIP_ORIENTATION.HORIZONTAL,
                getLength: () => 3,
                getStatus: () => SHIP_STATUS.DAMAGED,
                getPosition: () => ({ r: 8, c: 2 }),
                increaseNReceivedHits: () => {},
            }

            const mockShipDestroyed = {
                ...mockShipHit,
                getStatus: () => SHIP_STATUS.DESTROYED,
            }

            getShipStub.onCall(0).callsFake(() => mockShipHit)
            getShipStub.onCall(1).callsFake(() => mockShipHit)
            getShipStub.onCall(2).callsFake(() => mockShipDestroyed)

            battle.setInitalRandomShipPositions()

            battle.shot(8, 2) //hit part of s3l
            assert.deepEqual(battle.getFullState().board, config710x10BoardHit)

            battle.shot(8, 4) //hit part of s3l
            battle.shot(8, 5) //miss shot
            battle.shot(8, 3) //hit last part and destroy s3l
            boardConsoleLogger(battle.getFullState().board)
            assert.deepEqual(battle.getFullState().board, config710x10BoardDes)
        })

        it('Should allow the user to destroy vertical S3L', () => {
            setInitalRandomShipPositionsStub.onCall(0).callsFake(() => {
                board.placeConfigShipDistribution(config710x10Board)
            })
            battle.setInitalRandomShipPositions()

            const getShipStub = sandbox.stub(battle, 'getShipHit')

            const mockShipHit = {
                getOrientation: () => SHIP_ORIENTATION.VERTICAL,
                getLength: () => 3,
                getStatus: () => SHIP_STATUS.DAMAGED,
                getPosition: () => ({ r: 4, c: 5 }),
                increaseNReceivedHits: () => {},
            }

            const mockShipDestroyed = {
                ...mockShipHit,
                getStatus: () => SHIP_STATUS.DESTROYED,
            }

            getShipStub.onCall(0).callsFake(() => mockShipHit)
            getShipStub.onCall(1).callsFake(() => mockShipHit)
            getShipStub.onCall(2).callsFake(() => mockShipDestroyed)

            battle.setInitalRandomShipPositions()

            battle.shot(5, 5) //hit part of s3l
            assert.deepEqual(battle.getFullState().board, config710x10BoardHit2)

            battle.shot(6, 5) //hit part of s3l
            battle.shot(7, 5) //miss shot
            battle.shot(4, 5) //hit last part and destroy s3l
            assert.deepEqual(battle.getFullState().board, config710x10BoardDes2)
        })

        it('it Should allow the user to destroy horizontal S4L', () => {
            setInitalRandomShipPositionsStub.onCall(0).callsFake(() => {
                board.placeConfigShipDistribution(config710x10Board)
            })
            battle.setInitalRandomShipPositions()

            const getShipStub = sandbox.stub(battle, 'getShipHit')

            const mockShipHit = {
                getOrientation: () => SHIP_ORIENTATION.HORIZONTAL,
                getLength: () => 4,
                getStatus: () => SHIP_STATUS.DAMAGED,
                getPosition: () => ({ r: 1, c: 3 }),
                increaseNReceivedHits: () => {},
            }

            const mockShipDestroyed = {
                ...mockShipHit,
                getStatus: () => SHIP_STATUS.DESTROYED,
            }

            getShipStub.onCall(0).callsFake(() => mockShipHit)
            getShipStub.onCall(1).callsFake(() => mockShipHit)
            getShipStub.onCall(2).callsFake(() => mockShipHit)
            getShipStub.onCall(3).callsFake(() => mockShipDestroyed)

            battle.setInitalRandomShipPositions()

            battle.shot(5, 9) //miss shot
            battle.shot(1, 4) //hit part of s4l
            assert.deepEqual(battle.getFullState().board, config710x10BoardHit3)

            battle.shot(1, 6) //hit part of s4l
            battle.shot(1, 3) //hit part of s4l
            battle.shot(1, 5) //hit last part and destroy s3l
            assert.deepEqual(battle.getFullState().board, config710x10BoardDes3)
        })

        it('it Should allow the user to destroy horizontal S1L', () => {
            setInitalRandomShipPositionsStub.onCall(0).callsFake(() => {
                board.placeConfigShipDistribution(config810x10Board)
            })
            battle.setInitalRandomShipPositions()

            const getShipStub = sandbox.stub(battle, 'getShipHit')

            const mockShipDestroyed = {
                getOrientation: () => SHIP_ORIENTATION.HORIZONTAL,
                getLength: () => 1,
                getStatus: () => SHIP_STATUS.DESTROYED,
                getPosition: () => ({ r: 0, c: 8 }),
                increaseNReceivedHits: () => {},
            }

            getShipStub.onCall(0).callsFake(() => mockShipDestroyed)

            battle.setInitalRandomShipPositions()

            battle.shot(0, 8) //destroy s1L
            assert.deepEqual(battle.getFullState().board, config810x10BoardDes)
        })
    })
})
