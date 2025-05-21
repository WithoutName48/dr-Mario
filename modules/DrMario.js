import { Pill } from "./Pill.js";

export class DrMario {
    positions = [
        [
            {row: 0, col: 0},
            {row: -1, col: -1},
        ],
        [
            {row: -1, col: 0},
            {row: 0, col: -1},
        ],
        [
            {row: -1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 0, col: -1},
            {row: -1, col: 0},
        ],
        [
            {row: 0, col: 0},
            {row: -1, col: -1},
        ],
        [
            {row: 0, col: 0},
            {row: 1, col: -1},
        ],
        [
            {row: -1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 0, col: 0},
            {row: -1, col: -1},
        ],
        [
            {row: 0, col: 0},
            {row: 1, col: -1},
        ],
        [
            {row: -1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 0, col: 0},
            {row: -1, col: -1},
        ],
        [
            {row: 0, col: 0},
            {row: 1, col: -1},
        ],
        [
            {row: -1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 0, col: 0},
            {row: -1, col: -1},
        ],
        [
            {row: 1, col: 0},
            {row: 2, col: -1},
        ],
        [
            {row: -1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 1, col: -1},
            {row: 0, col: 0},
        ],
        [
            {row: 1, col: 0},
            {row: 1, col: 0},
        ],
        [
            {row: 1, col: 0},
            {row: 1, col: 0},
        ],
        [
            {row: 1, col: 0},
            {row: 1, col: 0},
        ],
        [
            {row: 1, col: 0},
            {row: 1, col: 0},
        ]
    ]
    rows;
    cols;
    tile_size;
    pf = [];
    drMario;
    current_pill;
    colors_pool;
    current_it = 0;

    constructor(rows, cols, tile_size, colors_pool) {
        this.rows = rows;
        this.cols = cols
        this.tile_size = tile_size;
        this.colors_pool = colors_pool;

        this.CreateBackEnd();
        this.CreateHTMLElement();

        this.GeneratePill();
    }

    CreateBackEnd() {
        for(let row = 0; row < this.rows; row++) {
            this.pf.push([]);
            for(let col = 0; col < this.cols; col++) {
                this.pf[row][col] = null;
            }
        }
    }

    CreateHTMLElement() {
        const container = document.querySelector(".container");
        const pfDiv = document.createElement("div");
        
        pfDiv.style.position = "absolute";
        pfDiv.style.top = "0px";
        pfDiv.style.left = "640px";
        pfDiv.style.display = 'grid';
        pfDiv.style.gridTemplate = `repeat(${this.rows}, 1fr) / repeat(${this.cols}, 1fr)`;

        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                const newTile = document.createElement("div");
                newTile.style.width = `${this.tile_size}px`;
                newTile.style.height = `${this.tile_size}px`;
                newTile.style.backgroundRepeat = "no-repeat";
                newTile.style.backgroundPositions = "center center";
                newTile.style.backgroundSize = "cover";
                newTile.setAttribute('id', `pill-fly-field${row}-${col}`);
                pfDiv.appendChild(newTile);
            }
        }

        pfDiv.style.width = `${this.cols * this.tile_size}px`;
        pfDiv.style.height = `${this.rows * this.tile_size}px`;


        pfDiv.classList.add("pill-fly-field");

        
        const drMarioDiv = document.createElement("div");

        drMarioDiv.style.width = `${7 * this.tile_size}px`;
        drMarioDiv.style.height = `${7 * this.tile_size}px`;
        drMarioDiv.style.position = "absolute";
        drMarioDiv.style.top = "96px";
        drMarioDiv.style.left = "960px";
        drMarioDiv.style.backgroundRepeat = "no-repeat";
        drMarioDiv.style.backgroundPositions = "center center";
        drMarioDiv.style.backgroundSize = "cover";
        
        drMarioDiv.setAttribute("id", "drMarioImg");

        container.appendChild(pfDiv);
        container.appendChild(drMarioDiv);
    }

    HandClear() {
        this.pf[4][11] = null;
        this.pf[5][10] = null;
        this.pf[5][11] = null;
        this.pf[6][10] = null;
        this.pf[6][11] = null;
        this.pf[7][11] = null;
    }

    HandUp() {
        this.HandClear()
        document.getElementById("pill-fly-field4-11").style.backgroundImage = `url("../img/ręka/up_1.png")`;
        document.getElementById("pill-fly-field5-11").style.backgroundImage = `url("../img/ręka/up_2.png")`;
        document.getElementById("pill-fly-field6-11").style.backgroundImage = `url("../img/ręka/up_3.png")`;
        this.pf[4][11] = "ręka";
        this.pf[5][11] = "ręka";
        this.pf[6][11] = "ręka";
    }

    HandMiddle() {
        this.HandClear()
        document.getElementById("pill-fly-field5-10").style.backgroundImage = `url("../img/ręka/middle11.png")`;
        document.getElementById("pill-fly-field5-11").style.backgroundImage = `url("../img/ręka/middle12.png")`;
        document.getElementById("pill-fly-field6-10").style.backgroundImage = `url("../img/ręka/middle21.png")`;
        document.getElementById("pill-fly-field6-11").style.backgroundImage = `url("../img/ręka/middle22.png")`;
        this.pf[5][10] = "ręka";
        this.pf[5][11] = "ręka";
        this.pf[6][10] = "ręka";
        this.pf[6][11] = "ręka";
    }

    HandDown() {
        this.HandClear()
        document.getElementById("pill-fly-field6-11").style.backgroundImage = `url("../img/ręka/down_1.png")`;
        document.getElementById("pill-fly-field7-11").style.backgroundImage = `url("../img/ręka/down_2.png")`;
        this.pf[6][11] = "ręka";
        this.pf[7][11] = "ręka";
    }

    GeneratePill() {
        const positions = [
            {"row": 3, "col": 10, "color": null, "id": 0},
            {"row": 3, "col": 11, "color": null, "id": 1}
        ];    
        this.current_pill = new Pill(this.pf, this.colors_pool, positions, "pill-fly-field");
        this.HandUp();
    }

    Update() {
        if(this.current_it < 4) {
            this.HandUp();
        }
        else if(4 <= this.current_it && this.current_it <= 6) {
            this.HandMiddle();
        }
        else {
            this.HandDown();
        }

        this.current_pill.positions.forEach((pos, indx) => {
            this.pf[pos.row][pos.col] = null;
            pos.row += this.positions[this.current_it][pos.id].row;
            pos.col += this.positions[this.current_it][pos.id].col;
            this.pf[pos.row][pos.col] = "pill";
        });

        this.current_it++;
    
        if(this.current_it == this.positions.length) {
            this.current_it = 0;
            this.current_pill.positions.forEach((pos, indx) => {
                this.pf[pos.row][pos.col] = null;
            });
            return true;
        }
        return false;
    }

    GameOver() {
        const drMarioDiv = document.getElementById("drMarioImg");
        drMarioDiv.style.backgroundImage = `url("../img/go_dr.png")`;
    }
}