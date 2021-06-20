export class Board {
    private width: number
    private height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    getFullState() {
        return {
            width: this.width,
            height: this.height,
        }
    }
}
