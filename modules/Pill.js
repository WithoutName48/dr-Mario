export class Pill {
    positions = [
        {"row": null, "col": null, "color": null, "id": null},
        {"row": null, "col": null, "color": null, "id": null}
    ];        
    pf;
    pf_name;
    colors_pool;
    url = "../img/tabletka/";

    constructor(pf, colors_pool, positions, pf_name) {
        this.pf = pf;
        this.pf_name = pf_name;
        this.colors_pool = colors_pool;

        this.positions.forEach((pos, indx) => {
            pos.row = positions[indx].row;
            pos.col = positions[indx].col;
            pos.color = positions[indx].color;
            pos.id = positions[indx].id;
        });

        this.GenerateColors();
        this.Draw();
        this.UpdateImg();
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    GenerateColors() {
        this.positions.forEach((pos, indx) => {
            pos.color = this.colors_pool[this.randomIntFromInterval(0, this.colors_pool.length - 1)];
        });
    }

    UpdateImg() {
        if(this.positions[0].row == this.positions[1].row) { // horizontally
            if(this.positions[0].col > this.positions[1].col) { // make postions[0] to the left of positions[1]
                let tmp = this.positions[0];
                this.positions[0] = this.positions[1];
                this.positions[1] = tmp;
            }

            const pos0_tile = document.getElementById(`${this.pf_name}${this.positions[0].row}-${this.positions[0].col}`);
            const pos1_tile = document.getElementById(`${this.pf_name}${this.positions[1].row}-${this.positions[1].col}`);

            pos0_tile.style.backgroundImage = `url("${this.url}${this.positions[0].color}_left.png")`;
            pos1_tile.style.backgroundImage = `url("${this.url}${this.positions[1].color}_right.png")`;
        }
        else { // vertically
            if(this.positions[0].row > this.positions[1].row) { // make postions[0] on top of positions[1]
                let tmp = this.positions[0];
                this.positions[0] = this.positions[1];
                this.positions[1] = tmp;
            }

            const pos0_tile = document.getElementById(`${this.pf_name}${this.positions[0].row}-${this.positions[0].col}`);
            const pos1_tile = document.getElementById(`${this.pf_name}${this.positions[1].row}-${this.positions[1].col}`);

            pos0_tile.style.backgroundImage = `url("${this.url}${this.positions[0].color}_up.png")`;
            pos1_tile.style.backgroundImage = `url("${this.url}${this.positions[1].color}_down.png")`;
        }
    }

    Draw() {
        this.positions.forEach((pos, indx) => {
            this.pf[pos.row][pos.col] = "pill";
        });
    }
    Clear() {
        this.positions.forEach((pos, indx) => {
            this.pf[pos.row][pos.col] = null;
        });
    }
}