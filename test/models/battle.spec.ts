import { assert } from 'chai'
import { Battle, BATTLE_MODES, BATTLE_STATUS } from '../../src/models/battle'

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
        }
        assert.deepEqual(battle.getFullState(), expectedBattle)
    })
})
