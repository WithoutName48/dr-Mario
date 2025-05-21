import { Animation } from "./Animation.js";

export class MagnifierVirus {
    positions = [
        { row: 0.5, col: 1.25 },
        { row: 2, col: 2 },
        { row: 3, col: 4 },
        { row: 3, col: 5.75 },
        { row: 1, col: 7 },
        { row: -0.5, col: 7 },
        { row: -2.5, col: 5.25 },
        { row: -2.5, col: 4 },
        { row: -1, col: 2 },
    ];
    offsetCol = 1;
    offsetRow = 16;
    animation;
    width;
    height;
    tile_size;
    color;
    current_it;

    constructor(width, height, tile_size, color, current_it, frames_duration) {
        this.width = width;
        this.height = height;
        this.tile_size = tile_size;
        this.color = color;
        this.current_it = current_it;

        this.CreateHTMLElement();

        this.animation = new Animation(`../img/lupa/${this.color}`, frames_duration, `magnifier-virus-${this.color}`);
    }

    CreateHTMLElement() {
        const container = document.querySelector(".container");
        const magnifierVirusDiv = document.createElement("div");
        
        magnifierVirusDiv.style.width = `${this.width}px`;
        magnifierVirusDiv.style.height = `${this.height}px`;
        magnifierVirusDiv.style.position = "absolute";
        magnifierVirusDiv.style.top = `${(this.offsetRow + this.positions[this.current_it].row) * this.tile_size}px`;
        magnifierVirusDiv.style.left = `${(this.offsetCol + this.positions[this.current_it].col) * this.tile_size}px`;
        magnifierVirusDiv.style.backgroundRepeat = "no-repeat";
        magnifierVirusDiv.style.backgroundPositions = "center center";
        magnifierVirusDiv.style.backgroundSize = "cover";

        magnifierVirusDiv.setAttribute("id", `magnifier-virus-${this.color}`);

        container.appendChild(magnifierVirusDiv);
    }

    UpdateAnimation() {
        if(this.animation.Update()) {
            this.MoveElement();
        }
    }

    MoveElement() {
        this.current_it = (this.current_it + 1) % this.positions.length;
        const magnifierVirusDiv = document.getElementById(`magnifier-virus-${this.color}`);
        
        magnifierVirusDiv.style.top = `${(this.offsetRow + this.positions[this.current_it].row) * this.tile_size}px`;
        magnifierVirusDiv.style.left = `${(this.offsetCol + this.positions[this.current_it].col) * this.tile_size}px`;
    }
}