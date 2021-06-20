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
    x: number
    y: number
}

export class Ship {
    name: string
    position: Coordinate[]
    hitted: Coordinate[]
    status = BATTLE_STATUS.IN_PROGRESS
}

export class Battle {
    battleId: string
    mode: string
    nAttemps: number
    status: string
    ships: Ship[] = []
    hitValue: number

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

    setInitalRandomShipPositions() {}

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
}
