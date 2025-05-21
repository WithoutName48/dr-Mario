export class Scoreboard {
    figure_cnt;
    url = "../img/cyfry/";
    name = "";
    tile_size;
    position_top;
    position_left;

    constructor(figure_cnt, name, tile_size, position_top, position_left) {
        this.figure_cnt = figure_cnt
        this.name = name;
        this.tile_size = tile_size;
        this.position_top = position_top;
        this.position_left = position_left;

        this.GenerateHTML();

        this.Update(0);
    }

    GenerateHTML() {
        const container = document.querySelector(`.container`);
        const scoreboard = document.createElement("div");
        scoreboard.classList.add(`scoreboard-${this.name}`);

        scoreboard.style.position = "absolute";
        scoreboard.style.height = `${this.tile_size}px`;
        scoreboard.style.width = `${this.tile_size * this.figure_cnt}px`;
        scoreboard.style.top = `${this.position_top}px`;
        scoreboard.style.left = `${this.position_left}px`;
        scoreboard.style.display = "grid";
        scoreboard.style.gridTemplate = `1fr / repeat(${this.figure_cnt}, 1fr)`

        for(let i = 0; i < this.figure_cnt; i++) {
            const tile = document.createElement("div");
            
            tile.setAttribute("id", `figure-${this.name}-${i}`);
            tile.style.width = `${this.tile_size}px`;
            tile.style.height = `${this.tile_size}px`;
            tile.style.backgroundImage = `url(${this.url}0.png)`;
            tile.style.backgroundRepeat = "no-repeat";
            tile.style.backgroundPositions = "center center";
            tile.style.backgroundSize = "cover";
            
            scoreboard.appendChild(tile);
        }

        container.appendChild(scoreboard);
    }

    Update(number) {
        number = "" + number;
        let str_number = "0".repeat(this.figure_cnt - number.length) + number;
        for(let i = 0; i < str_number.length; i++) {
            const num_title = document.getElementById(`figure-${this.name}-${i}`);
            num_title.style.backgroundImage = `url(${this.url}${str_number[i]}.png)`;
        }
    }
}