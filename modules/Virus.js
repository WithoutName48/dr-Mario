import { Animation } from "./Animation.js";

export class Virus {
    positions = [
        {"row": null, "col": null, "color": null}
    ];
    pf;
    id;
    colors_pool;
    rows;
    cols;
    url = "../img/wirusy/";
    animation;

    constructor(pf, id, colors_pool, rows, cols, start_row) {
        this.pf = pf;
        this.id = id;
        this.colors_pool = colors_pool;
        this.rows = rows;
        this.cols = cols;

        this.GenerateColors();
        this.GeneratePosition(start_row);

        this.animation = new Animation(this.url + this.positions[0].color, [30, 30], `pf${this.positions[0].row}-${this.positions[0].col}`);
    }

    GenerateColors() {
        this.positions[0].color = this.colors_pool[this.id % this.colors_pool.length];
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    GeneratePosition(start_row) {
        let available_positions = [];
        for(let row = start_row; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                if(this.pf[row][col] != null) continue;
                available_positions.push([row, col]);
            }
        }
        let res = available_positions[this.randomIntFromInterval(0, available_positions.length - 1)];
        this.positions[0].row = res[0];
        this.positions[0].col = res[1];
        this.pf[this.positions[0].row][this.positions[0].col] = `virus-${this.id}`;
    }

    DeletePos(row, col) {
        if(this.positions[0].row == row && this.positions[0].col == col) {
            this.positions.splice(0, 1);
        }
    }

    GetColor(row, col) {
        let color = null;
        if(this.positions[0].row == row && this.positions[0].col == col) {
            color = this.positions[0].color;
        }
        return color;
    }

    GetLowestRow() {
        return this.positions[0].row;
    }

    ChangeImgErase() {
        const pos0_tile = document.getElementById(`pf${this.positions[0].row}-${this.positions[0].col}`);
        pos0_tile.style.backgroundImage = `url("${this.url}${this.positions[0].color}_x.png")`;
    }

    UpdateAnimation() {
        this.animation.Update();
    }

    Draw() {
        this.pf[this.positions[0].row][this.positions[0].col] = `virus-${this.id}`;
    }
    Clear() {
        this.pf[this.positions[0].row][this.positions[0].col] = null;
    }
}