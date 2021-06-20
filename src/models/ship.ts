export enum SHIP_TYPE {
    S4L = 'S4L', //4 spaces long
    S3L = 'S3L', //3 spaces long
    S2L = 'S2L', //2 spaces long
    S1L = 'S1L', //1 spaces long
}

export enum SHIP_ORIENTATION {
    HORIZONTAL = 'HORIZONTAL',
    VERTICAL = 'VERTICAL',
}

export enum SHIP_STATUS {
    DAMAGED = 'DAMAGED',
    DESTROYED = 'DESTROYED',
    PERFECT = 'PERFECT',
}

import { Coordinate } from './battle'

export class Ship {
    private type: SHIP_TYPE
    private length: number
    private orientation: SHIP_ORIENTATION
    private hit: Number[]
    private status: SHIP_STATUS

    constructor(type: SHIP_TYPE) {
        this.type = type

        if (type === SHIP_TYPE.S4L) this.length = 4
        if (type === SHIP_TYPE.S3L) this.length = 3
        if (type === SHIP_TYPE.S2L) this.length = 2
        if (type === SHIP_TYPE.S1L) this.length = 1

        this.orientation = SHIP_ORIENTATION.HORIZONTAL
        this.hit = []
        this.status = SHIP_STATUS.PERFECT
    }

    getFullState() {
        return {
            type: this.type,
            length: this.length,
            orientation: this.orientation,
            hit: this.hit,
            status: this.status,
        }
    }

    getLength() {
        return this.length
    }

    setOrientation(orientation: SHIP_ORIENTATION) {
        this.orientation = orientation
    }

    getOrientation() {
        return this.orientation
    }

    getType() {
        return this.type
    }
}
