import { Component } from "@angular/core";
import { Player, Direction, Board } from "../../classes/index";
import { HostListener } from "@angular/core";

@Component({
  selector: "app-tron-component",
  templateUrl: "./tron.component.html",
  styleUrls: ["./tron.component.css"]
})

export class TronComponent {

  player1: Player = null;
  player2: Player = null;

  turnCount = { 1: 0, 2: 0 };
  waitingPress = { 1: null, 2: null };
  history = {};

  constructor () {
    document.body.style.backgroundImage = "url('assets/blue-stripes.gif')";
    document.body.style.textAlign = "center";
  }

  private startGame() {
    const boardPosition = this.getBoardPosition();
    this.player1 =
      new Player("cyan", 3, new Direction(boardPosition.left + 180, boardPosition.top + 200), new Direction(0, -1), 1, "player1");
    this.player2 =
      new Player("magenta", 3, new Direction(boardPosition.left + 220, boardPosition.top + 200), new Direction(0, -1), 1, "player2");

    const self = this;
    const gameplay = setInterval(function () {
      if (self.turnCount[1] === 10) {
        self.turnCount[1] = 0;
        if (self.waitingPress[1]) {
          self.onKeyDown(self.waitingPress[1]);
          self.waitingPress[1] = null;
        }
      }

      if (self.turnCount[2] === 10) {
        self.turnCount[2] = 0;
        if (self.waitingPress[2]) {
          self.onKeyDown(self.waitingPress[2]);
          self.waitingPress[2] = null;
        }
      }
      self.player1.move(self.turnCount[1]);
      for (let i = 0; i < self.player1.trailCoordinates.length; i++) {
        history[self.player1.trailCoordinates[i]] = true;
      }
      self.turnCount[1] += self.player1.currentSpeed();

      self.player2.move(self.turnCount[2]);
      for (let i = 0; i < self.player2.trailCoordinates.length; i++) {
        history[self.player2.trailCoordinates[i]] = true;
      }
      self.turnCount[2] += self.player2.currentSpeed();

      if (self.crashed()) {
        clearInterval(gameplay);
        alert("CRASH BANG WALLOP, what a video.");
        self.reset();
      }
    }, 10);
  }

  @HostListener("window:keydown", ["$event"])
  private onKeyDown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 77:
        if (this.turnCount[2] === 0) {
          e.preventDefault();
          if (this.player2.boosts > 0 && !this.player2.isBoosting) {
            this.player2.isBoosting = true;
            this.player2.boosts--;
            this.player2.changeSpeed(2);
          }
        } else {
          this.waitingPress[2] = e;
        }
        break;
      case 37:
        if (this.turnCount[2] === 0) {
          if (this.player2.direction.x !== 1) {
            this.player2.changeDirection({ x: -1, y: 0 });
          }
        } else {
          this.waitingPress[2] = e;
        }
        break;
      case 38:
        if (this.turnCount[2] === 0) {
          if (this.player2.direction.y !== 1) {
            this.player2.changeDirection({ x: 0, y: -1 });
          }
        } else {
          this.waitingPress[2] = e;
        }
        break;
      case 39:
        if (this.turnCount[2] === 0) {
          if (this.player2.direction.x !== -1) {
            this.player2.changeDirection({ x: 1, y: 0 });
          }
        } else {
          this.waitingPress[2] = e;
        }
        break;
      case 40:
        if (this.turnCount[2] === 0) {
          if (this.player2.direction.y !== -1) {
            this.player2.changeDirection({ x: 0, y: 1 });
          }
        } else {
          this.waitingPress[2] = e;
        }
        break;
      case 49:
        if (this.turnCount[1] === 0) {
          e.preventDefault();
          if (this.player1.boosts > 0 && !this.player1.isBoosting) {
            this.player1.isBoosting = true;
            this.player1.boosts--;
            this.player1.changeSpeed(2);
          }
        } else {
          this.waitingPress[1] = e;
        }
        break;
      case 65:
        if (this.turnCount[1] === 0) {
          if (this.player1.direction.x !== 1) {
            this.player1.changeDirection({ x: -1, y: 0 });
          }
        } else {
          this.waitingPress[1] = e;
        }
        break;
      case 87:
        if (this.turnCount[1] === 0) {
          if (this.player1.direction.y !== 1) {
            this.player1.changeDirection({ x: 0, y: -1 });
          }
        } else {
          this.waitingPress[1] = e;
        }
        break;
      case 68:
        if (this.turnCount[1] === 0) {
          if (this.player1.direction.x !== -1) {
            this.player1.changeDirection({ x: 1, y: 0 });
          }
        } else {
          this.waitingPress[1] = e;
        }
        break;
      case 83:
        if (this.turnCount[1] === 0) {
          if (this.player1.direction.y !== -1) {
            this.player1.changeDirection({ x: 0, y: 1 });
          }
        } else {
          this.waitingPress[1] = e;
        }
        break;
    }
  }

  private crashed() {
    let crashed = false;

    if (this.playerCrashedIntoWall(this.player1) || this.playerCrashedIntoWall(this.player2)) {
      crashed = true;
    } else {
      const player1Postion = this.player1.position();
      const player2Postion = this.player2.position();
      const currentCoordinates1 = player1Postion.x + "," + player1Postion.y;
      const currentCoordinates2 = player2Postion.x + "," + player2Postion.y;
      if (history[currentCoordinates1] || history[currentCoordinates2]) {
        crashed = true;
      }
    }

    return crashed;
  }

  private playerCrashedIntoWall(player: Player): boolean {
    const boardPosition = this.getBoardPosition();
    const playerPostion = player.position();
    return playerPostion.x < boardPosition.left ||
      (playerPostion.x + 10) > boardPosition.right ||
      (playerPostion.y + 10) > boardPosition.bottom ||
      playerPostion.y < boardPosition.top;
  }

  private getBoardPosition(): Board {
    const board = document.getElementById("board");
    const top = board.offsetTop;
    const bottom = board.offsetTop + board.offsetHeight;
    const left = board.offsetLeft;
    const right = board.offsetLeft + board.offsetWidth;
    return new Board(top, bottom, left, right);
  }

  private reset() {
    this.history = {};
  }
}
