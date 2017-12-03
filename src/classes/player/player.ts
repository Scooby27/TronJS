import { Direction } from "../direction/direction";

export class Player {
    id: string;
    boosts: number;
    isBoosting: boolean;
    direction: Direction;
    colour: string;
    trailCoordinates: Array<string>;
    currentSpeed: () => number;
    position: () => Direction;
    changeDirection: (direction: Direction) => void;
    changeSpeed: (speed: number) => void;
    move: (turnCount: number) => void;
    private x: number;
    private y: number;
    private previousDirection: Direction;
    private speed: number;
    private noOfTrails: number;
    private boostDuration: number;
    private leaveTrail: (x: number, y: number, speed: number, direction: Direction, turnCount: number) => void;

    constructor(
        colour: string,
        startingBoosts: number,
        startingPosition: Direction,
        startingDirection: Direction,
        startingSpeed: number,
        id: string) {
        this.colour = colour;
        this.boosts = startingBoosts;
        this.x = startingPosition.x;
        this.y = startingPosition.y;
        this.direction = startingDirection;
        this.speed = startingSpeed;
        this.previousDirection = null;
        this.noOfTrails = 0;
        this.boostDuration = 0;
        this.id = id;
        this.trailCoordinates = new Array<string>();
        const self = this;

        this.position = function (): Direction {
            return new Direction(this.x, this.y);
        };

        this.currentSpeed = function (): number {
            return this.speed;
        };

        this.changeDirection = function (direction: Direction): void {
            this.previousDirection = this.direction;
            this.direction = direction;
        };

        this.changeSpeed = function (speed: number): void {
            this.speed = speed;
        };

        this.move = function (turnCount: number): void {
            self.leaveTrail(this.x, this.y, this.speed, this.direction, turnCount);
            this.trailCoordinates = new Array<string>();
            this.trailCoordinates.push(this.x + "," + this.y);
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;
            if (this.isBoosting) {
                const missedTrail = (this.x - this.direction.x).toString() + "," + (this.y - this.direction.y).toString();
                this.trailCoordinates.push(missedTrail);
                if (this.boostDuration !== 100) {
                    this.boostDuration++;
                } else {
                    this.boostDuration = 0;
                    this.isBoosting = false;
                    this.changeSpeed(startingSpeed);
                }
            }

        };

        this.leaveTrail = function (x: number, y: number, speed: number, direction: Direction, turnCount: number) {
            let trail = document.getElementById(this.id + this.noOfTrails.toString());
            const seed = speed === 2 && turnCount !== 10 ? 1 : 0;
            if (this.previousDirection !== direction || trail === null) {
                this.previousDirection = this.direction;
                this.noOfTrails++;
                trail = document.createElement("div");
                trail.id = this.id + this.noOfTrails.toString();
                trail.className = "trail";
                trail.style.width = direction.x === 0 ? "10px" : speed.toString() + "px";
                trail.style.height = direction.y === 0 ? "10px" : speed.toString() + "px";

                if (direction.x === -1) {
                    trail.style.width = "10px";
                }

                if (direction.y === -1) {
                    trail.style.height = "10px";
                }

                trail.style.backgroundColor = colour;
                trail.style.position = "absolute";
                if (direction.y === -1) {
                    trail.style.top = (y + 10).toString() + "px";
                    trail.style.left = x.toString() + "px";
                }
                if (direction.y === 1) {
                    trail.style.top = y.toString() + "px";
                    trail.style.left = x.toString() + "px";
                }

                if (direction.x === -1) {
                    trail.style.top = y.toString() + "px";
                    trail.style.left = (x + 10).toString() + "px";
                }
                if (direction.x === 1) {
                    trail.style.top = y.toString() + "px";
                    trail.style.left = x.toString() + "px";
                }
                document.getElementById("board").appendChild(trail);
            } else {
                const decimalRadix = 10;
                const currentWidth = parseInt(trail.style.width, decimalRadix);
                const currentHeight = parseInt(trail.style.height, decimalRadix);
                trail.style.width = direction.x === 0 ? "10px" : (speed + currentWidth).toString() + "px";
                trail.style.height = direction.y === 0 ? "10px" : (speed + currentHeight).toString() + "px";
                if (this.direction.x === -1) {
                    trail.style.left = x.toString() + "px";
                }
                if (this.direction.x === 0) {
                    trail.style.left = x.toString() + "px";
                }
                if (this.direction.y === -1) {
                    trail.style.top = y.toString() + "px";
                }
            }
        };
    }
}
