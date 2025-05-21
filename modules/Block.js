export class Block {
    positions = [];      
    pf;
    id;
    url = "../img/tabletka/";

    constructor(pf, id, positions) {
        this.pf = pf;
        this.id = id;

        positions.forEach((pos, indx) => {
            this.positions.push(pos);
        });
    }

    DeletePos(row, col) {
        this.positions.forEach((pos, indx) => {
            if(pos.row == row && pos.col == col) {
                this.positions.splice(indx, 1);
            }
        });
    }

    GetLowestRow() {
        let maxxrow = -1;
        this.positions.forEach((pos, indx) => {
            if(maxxrow < pos.row)
                maxxrow = pos.row;
        });
        return maxxrow;
    }

    GetColor(row, col) {
        let color = null;
        this.positions.forEach((pos, indx) => {
            if(pos.row == row && pos.col == col) {
                color = pos.color;
            }
        });
        return color;
    }

    UpdateImg() {
        if(this.positions.length == 2) {
            if(this.positions[0].row == this.positions[1].row) { // horizontally
                if(this.positions[0].col > this.positions[1].col) { // make postions[0] to the left of positions[1]
                    let tmp = this.positions[0];
                    this.positions[0] = this.positions[1];
                    this.positions[1] = tmp;
                }
    
                const pos0_tile = document.getElementById(`pf${this.positions[0].row}-${this.positions[0].col}`);
                const pos1_tile = document.getElementById(`pf${this.positions[1].row}-${this.positions[1].col}`);
    
                pos0_tile.style.backgroundImage = `url("${this.url}${this.positions[0].color}_left.png")`;
                pos1_tile.style.backgroundImage = `url("${this.url}${this.positions[1].color}_right.png")`;
            }
            else { // vertically
                if(this.positions[0].row > this.positions[1].row) { // make postions[0] on top of positions[1]
                    let tmp = this.positions[0];
                    this.positions[0] = this.positions[1];
                    this.positions[1] = tmp;
                }
    
                const pos0_tile = document.getElementById(`pf${this.positions[0].row}-${this.positions[0].col}`);
                const pos1_tile = document.getElementById(`pf${this.positions[1].row}-${this.positions[1].col}`);
    
                pos0_tile.style.backgroundImage = `url("${this.url}${this.positions[0].color}_up.png")`;
                pos1_tile.style.backgroundImage = `url("${this.url}${this.positions[1].color}_down.png")`;
            }
        }
        else if(this.positions.length == 1) {
            const pos0_tile = document.getElementById(`pf${this.positions[0].row}-${this.positions[0].col}`);
            pos0_tile.style.backgroundImage = `url("${this.url}${this.positions[0].color}_dot.png")`;
        }
    }

    ChangeImgErase(row, col) {
        this.positions.forEach((pos, indx) => {
            if(row == pos.row && col == pos.col) {
                const pos_tile = document.getElementById(`pf${pos.row}-${pos.col}`);
                pos_tile.style.backgroundImage = `url("${this.url}${pos.color}_o.png")`;
            }
        });
    }

    Draw() {
        this.positions.forEach((pos, indx) => {
            this.pf[pos.row][pos.col] = `block-${this.id}`;
        });
    }
    Clear() {
        this.positions.forEach((pos, indx) => {
            this.pf[pos.row][pos.col] = null;
        });
    }
}