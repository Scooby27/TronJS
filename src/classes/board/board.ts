export class Board {
    top: number;
    bottom: number;
    left: number;
    right: number;

    constructor (top: number, bottom: number, left: number, right: number) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }
}
