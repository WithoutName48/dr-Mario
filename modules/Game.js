import { Block } from './Block.js'
import { Virus } from './Virus.js'
import { Scoreboard } from './Scoreboard.js';
import { MagnifierVirus } from './MagnifierVirus.js';
import { DrMario } from './DrMario.js';

export class Game {
    rows;
    cols; 
    tile_size;
    pf;
    colors_pool;
    current_pill;
    GameLoopProperties = {
        timeStep: 750,
        previousTime: 0.0,
        delta: 0.0
    }
    blockMoves = false;
    nextIdBlock = 0;
    nextIdVirus = 0;
    virus_colors;
    virus_start_count;
    virus_count;
    points;
    pfObjects = new Map();
    fallingBlocks = new Set();
    scoreboards = new Map();
    magnifierViruses = new Map();
    drMario;
    gameEnd = false;
    ERASE_ANIMATION_TIME = 1000;

    constructor(rows, cols, tile_size) {
        this.rows = rows;
        this.cols = cols;
        this.tile_size = tile_size;
        this.pf = [];
        this.colors_pool = ['brown', 'blue', 'yellow']
        this.current_pill = null;
        this.virus_colors = ['brown', 'blue', 'yellow']
        this.points = 0;
        this.virus_start_count = 4;
        this.virus_count = 0;

        this.CreatePlayFieldBackEnd();
        this.CreatePlayFieldHTML();

        this.GameLoopManager();
    }

    CreatePlayFieldBackEnd() {
        for(let i = 0; i < this.rows; i++) {
            this.pf[i] = [];
            for(let j = 0; j < this.cols; j++) {
                this.pf[i][j] = null;
            }
        }
    }
    CreatePlayFieldHTML() {
        const container = document.querySelector(`.container`);
        const playfield = document.createElement("div");
        playfield.classList.add("playfield")

        playfield.style.width = `${this.cols * this.tile_size}px`;
        playfield.style.height = `${this.rows * this.tile_size}px`;
        playfield.style.position = "absolute";
        playfield.style.top = "192px";
        playfield.style.left = "544px";
        playfield.style.display = 'grid';
        playfield.style.gridTemplate = `repeat(${this.rows}, 1fr) / repeat(${this.cols}, 1fr)`;

        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                const newTile = document.createElement("div");
                newTile.style.width = `${this.tile_size}px`;
                newTile.style.height = `${this.tile_size}px`;
                newTile.style.backgroundRepeat = "no-repeat";
                newTile.style.backgroundPositions = "center center";
                newTile.style.backgroundSize = "cover";
                newTile.setAttribute('id', `pf${row}-${col}`);
                playfield.appendChild(newTile);
            }
        }
        
        container.appendChild(playfield);
    }

    GenerateViruses() {
        for(let i = 0; i < this.virus_start_count; i++) {
            this.pfObjects[`virus-${this.nextIdVirus}`] = new Virus(this.pf, this.nextIdVirus, this.virus_colors, this.rows, this.cols, 3);
            this.nextIdVirus++;
            this.virus_count++;
        }
    }

    GenerateScoreboards() {
        this.scoreboards["record"] = new Scoreboard(7, "record", this.tile_size, 160, 160);
        this.scoreboards["current"] = new Scoreboard(7, "current", this.tile_size, 256, 160);
        this.scoreboards["virus-count"] = new Scoreboard(2, "virus-count", this.tile_size, 670, 1120);
        
        let record = localStorage.getItem("record");
        if(record != null)
            this.scoreboards["record"].Update(record);

        this.scoreboards["virus-count"].Update(this.virus_count)
    }

    GenerateMagnifierViruses() {
        const animationTime = 60;
        let frames_duration = [];
        for(let i = 0; i < 5; i++) {
            frames_duration.push(animationTime);
        }

        this.magnifierViruses.set("brown", new MagnifierVirus(134.4, 100.8, this.tile_size, "brown", 0, frames_duration));
        this.magnifierViruses.set("blue", new MagnifierVirus(134.4, 100.8, this.tile_size, "blue", 3, frames_duration));
        this.magnifierViruses.set("yellow", new MagnifierVirus(134.4, 100.8, this.tile_size, "yellow", 6, frames_duration));
    }

    GenerateDrMario() {
        this.drMario = new DrMario(8, 12, this.tile_size, this.colors_pool);
    }

    GameLoopManager() {
        // Launch
        window.requestAnimationFrame(time => {
            this.GameLoopProperties.previousTime = time;
            
            // Initalization
            this.EventListenersManager();
            this.GenerateViruses();
            this.GenerateScoreboards();
            this.GenerateMagnifierViruses();
            this.GenerateDrMario();

            window.requestAnimationFrame(loop);
        });

        // Game Loop
        const loop = async time => {
            // Accumulate delta time
            this.GameLoopProperties.delta += time - this.GameLoopProperties.previousTime;
            // Update the previous time
            this.GameLoopProperties.previousTime = time;

            // Update game
            while(this.GameLoopProperties.delta > this.GameLoopProperties.timeStep) {
                let delay = 0;
                await new Promise((resolve) => {
                    resolve(this.UpdateBlockFalling());
                }).then(
                    (fdelay) => {
                        delay = fdelay;
                    }
                )

                if(this.gameEnd)
                    return;
                
                this.GameLoopProperties.delta -= (this.GameLoopProperties.timeStep + delay);
            }
            // Render game
            this.Render();
            
            // Repeat
            window.requestAnimationFrame(loop);
        }

    }

    GameEnd(reason) {
        const container = document.querySelector(".container");
        const gameOverDiv = document.createElement("div");
        
        if(reason == "game-over") {
            this.drMario.GameOver();
            gameOverDiv.style.backgroundImage = "url('../img/go.png')";
            gameOverDiv.style.width = "668px";
        }
        else if(reason == "stage-completed") {
            gameOverDiv.style.backgroundImage = "url('../img/sc.png')";
            gameOverDiv.style.width = "846px";
        }

        gameOverDiv.style.height = "238px";
        gameOverDiv.style.backgroundRepeat = "no-repeat";
        gameOverDiv.style.backgroundPositions = "center center";
        gameOverDiv.style.backgroundSize = "cover";
        gameOverDiv.style.position = "absolute";
        gameOverDiv.style.top = "50%";
        gameOverDiv.style.left = "50%";
        gameOverDiv.style.transform = "translate(-50%, -50%)";

        container.appendChild(gameOverDiv);
    
        this.gameEnd = true;
    }

    async UpdateBlockFalling() {
        // Stage completed
        if(this.virus_count == 0) {
            this.GameEnd("stage-completed");
            return;
        }
        
        const CheckEndBoundaries = (new_pos) => {
            // Out of bounds vertically
            if(new_pos.row >= this.rows) {
                return true;
            }       
            // Check if blocked
            if(this.pf[new_pos.row][new_pos.col] != null) {
                return true;
            }
            return false;
        }

        const CheckIfEnd = (block) => {
            let end = false;
            let id = null;
            block.positions.forEach((piece, indx) => {
                id = this.pf[piece.row][piece.col];
                piece.row++;
                if(CheckEndBoundaries(piece)) {
                    end = true;
                }
                else {
                    this.pf[piece.row - 1][piece.col] = null;
                }
            });
            if(end) {
                block.positions.forEach((piece, indx) => {
                    piece.row--;
                    if(!CheckEndBoundaries(piece)) {
                        this.pf[piece.row][piece.col] = id;
                    }
                });
            }
            else {
                block.positions.forEach((piece, indx) => {
                    this.pf[piece.row][piece.col] = id;
                });
            }
            return end;
        }

        let delay = 0;
        if(this.fallingBlocks.size == 0) {
            // Game over
            if(this.current_pill == null && (this.pf[0][3] != null || this.pf[0][4] != null)) {
                this.GameEnd("game-over");
                return;
            }

            // New Pill
            if(this.current_pill == null) {
                this.GameLoopProperties.timeStep = 75;
                this.GameLoopProperties.delta = 0.0;
                this.blockMoves = true;

                // Animation with dr. Mario
                if(this.drMario.Update()) {
                    const positions = [
                        {"row": 0, "col": 3},
                        {"row": 0, "col": 4}
                    ];   
                    this.current_pill = this.drMario.current_pill;
                    this.current_pill.pf = this.pf;
                    this.current_pill.pf_name = "pf";
                    this.current_pill.positions.forEach((pos, indx) => {
                        pos.row = positions[indx].row;
                        pos.col = positions[indx].col;
                    });
                    this.current_pill.positions.forEach((pos, indx) => {
                        this.pf[pos.row][pos.col] = "pill";
                    });

                    this.drMario.HandUp();
                    this.drMario.GeneratePill();

                    this.GameLoopProperties.timeStep = 500;
                    this.GameLoopProperties.delta = 0.0;
                    this.blockMoves = false;
                }
                
                return 0;
            }

            if(this.current_pill.positions[0].row < this.current_pill.positions[1].row) {
                let tmp = this.current_pill.positions[0];
                this.current_pill.positions[0] = this.current_pill.positions[1];
                this.current_pill.positions[1] = tmp;
            }
                
            // End of current pill
            if(CheckIfEnd(this.current_pill)) {
                this.pfObjects[`block-${this.nextIdBlock}`] = new Block(this.pf, this.nextIdBlock, this.current_pill.positions)
                this.pfObjects[`block-${this.nextIdBlock}`].Draw();
                this.current_pill.positions.forEach((pos, indx) => {
                    this.pf[pos.row][pos.col] = `block-${this.nextIdBlock}`;
                });

                this.nextIdBlock++;
                this.current_pill = null;
                
                
                await new Promise((resolve) => {
                    resolve(this.CheckForPoints());
                }).then(
                    (fdelay) => delay = fdelay
                );
            }
        }
        else {
            let checkPoints = false;
            this.fallingBlocks.forEach((block, indx) => {
                if(this.pfObjects[block].positions.length == 2 && this.pfObjects[block].positions[0].row < this.pfObjects[block].positions[1].row) {
                    let tmp = this.pfObjects[block].positions[0];
                    this.pfObjects[block].positions[0] = this.pfObjects[block].positions[1];
                    this.pfObjects[block].positions[1] = tmp;
                }

                if(CheckIfEnd(this.pfObjects[block])) {
                    this.fallingBlocks.delete(block);
                    checkPoints = true;
                }
            });
            if(checkPoints) {
                let delay = 0;
                await new Promise((resolve) => {
                    resolve(this.CheckForPoints());
                }).then(
                    (fdelay) => delay = fdelay
                );
            }
        }
        return delay;
    }

    UpdateUserMove(event) {    
        const CheckMove = (new_pos1, new_pos2) => {
            // Out of bounds horizontally
            if(!(0 <= new_pos1.col && new_pos1.col < this.cols && 0 <= new_pos2.col && new_pos2.col < this.cols && 0 <= new_pos1.row && new_pos1.row < this.rows && 0 <= new_pos2.row && new_pos2.row < this.rows)) {
                return false;
            }
            // Check availability of new position
            if(this.pf[new_pos1.row][new_pos1.col] != null || this.pf[new_pos2.row][new_pos2.col] != null) {
                return false;
            }
            return true;
        }
        
        if(this.current_pill == null || this.blockMoves)
            return;

        if(event.key == "ArrowRight" || event.key == "d") {
            this.current_pill.Clear();
            this.current_pill.positions[0].col++;
            this.current_pill.positions[1].col++;
            if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                this.current_pill.positions[0].col--;
                this.current_pill.positions[1].col--;
            }
            this.current_pill.Draw();
        }
        else if(event.key == "ArrowLeft" || event.key == "a") {
            this.current_pill.Clear();
            this.current_pill.positions[0].col--;
            this.current_pill.positions[1].col--;
            if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                this.current_pill.positions[0].col++;
                this.current_pill.positions[1].col++;
            }
            this.current_pill.Draw();
        }
        else if(event.key == "ArrowUp" || event.key == "w") { // Rotate left
            this.current_pill.Clear();
            if(this.current_pill.positions[0].col == this.current_pill.positions[1].col) { // vertically placed
                if(this.current_pill.positions[0].row > this.current_pill.positions[1].row) { // pos2 on top of pos1; element swap
                    let tmp = this.current_pill.positions[0];
                    this.current_pill.positions[0] = this.current_pill.positions[1];
                    this.current_pill.positions[1] = tmp;
                }
                this.current_pill.positions[0].row++;
                this.current_pill.positions[1].col++;
                if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                    this.current_pill.positions[0].col--;
                    this.current_pill.positions[1].col--;
                    if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                        this.current_pill.positions[0].col++;
                        this.current_pill.positions[0].row--;
                    }
                }
            }
            else { // horizontally placed
                if(this.current_pill.positions[0].col > this.current_pill.positions[1].col) { // pos2 left of pos1; element swap
                    let tmp = this.current_pill.positions[0];
                    this.current_pill.positions[0] = this.current_pill.positions[1];
                    this.current_pill.positions[1] = tmp;
                }
                this.current_pill.positions[1].row--;
                this.current_pill.positions[1].col--;
                if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                    this.current_pill.positions[1].row++;
                    this.current_pill.positions[1].col++;
                }
            }
            this.current_pill.Draw();
        }
        else if(event.key == "Shift") { // Rotate right
            this.current_pill.Clear();
            if(this.current_pill.positions[0].col == this.current_pill.positions[1].col) { // vertically placed
                if(this.current_pill.positions[0].row > this.current_pill.positions[1].row) { // pos2 on top of pos1; element swap
                    let tmp = this.current_pill.positions[0];
                    this.current_pill.positions[0] = this.current_pill.positions[1];
                    this.current_pill.positions[1] = tmp;
                }
                this.current_pill.positions[0].row++;
                this.current_pill.positions[0].col++;
                if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                    this.current_pill.positions[0].col--;
                    this.current_pill.positions[1].col--;
                    if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                        this.current_pill.positions[0].row--;
                        this.current_pill.positions[1].col++;
                    }
                }
            }
            else { // horizontally placed
                if(this.current_pill.positions[0].col > this.current_pill.positions[1].col) {  // pos2 left of pos1; element swap
                    let tmp = this.current_pill.positions[0];
                    this.current_pill.positions[0] = this.current_pill.positions[1];
                    this.current_pill.positions[1] = tmp;
                }
                this.current_pill.positions[0].row--;
                this.current_pill.positions[1].col--;
                if(!CheckMove(this.current_pill.positions[0], this.current_pill.positions[1])) {
                    this.current_pill.positions[0].row++;
                    this.current_pill.positions[1].col++;
                }
            }
            this.current_pill.Draw();
        }
        else if(event.key == "ArrowDown" || event.key == "s") { // fall down
            this.blockMoves = true;
            this.GameLoopProperties.timeStep = 50;
            this.GameLoopProperties.delta = 0.0;
        }
    }

    EventListenersManager() {
        const limit = 150
        let lastCall = 0.0;
        document.addEventListener('keydown', (event) => {
            if(this.blockMoves) {
                lastCall = Date.now();
                return;
            }
            
            const now = Date.now();
            if(now - lastCall >= limit) {
                lastCall = now;
                this.UpdateUserMove(event);
            }
        });
    }

    async CheckForPoints() {
        // Check if can erase anything
        let erased = [];
        for(let row = 0; row < this.rows; row++) {
            erased.push([]);
            for(let col = 0; col < this.cols; col++) {
                erased[row][col] = false;
            }
        }

        let erasedAny = false, erasedVirus = false;
        let ToEraseFromPf = [];
        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                if(this.pf[row][col] == null)
                    continue;
                
                // Checking row
                const color = this.pfObjects[this.pf[row][col]].GetColor(row, col);
                let cnt_same = 0;
                for(let k = 0; col + k < this.cols; k++) {
                    if(this.pf[row][col + k] == null) break;
                    if(color == this.pfObjects[this.pf[row][col + k]].GetColor(row, col + k))
                        cnt_same++;
                    else
                        break;
                }
                if(cnt_same >= 4) {
                    erasedAny = true;
                    for(let k = 0; k < cnt_same; k++) {
                        if(this.pf[row][col + k].split("-")[0] == "virus") {
                            this.points += 100;
                            this.virus_count--;
                            erasedVirus = true;
                        }

                        this.pfObjects[this.pf[row][col + k]].ChangeImgErase(row, col + k);

                        this.pfObjects[this.pf[row][col + k]].positions.forEach((pos, indx) => {
                            if(!(pos.row == row && pos.col == col + k) && (pos.color != color || pos.row != row) && pos.row + 1 < this.rows && this.pf[pos.row + 1][pos.col] == null) {
                                this.fallingBlocks.add(this.pf[pos.row][pos.col]);
                                erased[pos.row][pos.col] = true;
                            }
                        });
                        
                        erased[row][col + k] = true;
                        ToEraseFromPf.push([row, col + k]);
                    }
                }

                // Checking col
                cnt_same = 0;
                for(let k = 0; row + k < this.rows; k++) {
                    if(this.pf[row + k][col] == null) break;
                    if(color == this.pfObjects[this.pf[row + k][col]].GetColor(row + k, col))
                        cnt_same++;
                    else
                        break;
                }
                if(cnt_same >= 4) {
                    erasedAny = true;
                    for(let k = 0; k < cnt_same; k++) {
                        if(this.pf[row + k][col].split("-")[0] == "virus") {
                            this.points += 100;
                            this.virus_count--;
                            erasedVirus = true;
                        }

                        this.pfObjects[this.pf[row + k][col]].ChangeImgErase(row + k, col);

                        this.pfObjects[this.pf[row + k][col]].positions.forEach((pos, indx) => {
                            if(!(pos.row == row + k && pos.col == col) && (pos.color != color || pos.col != col) && pos.row + 1 < this.rows && this.pf[pos.row + 1][pos.col] == null) {
                                this.fallingBlocks.add(this.pf[pos.row][pos.col]);
                                erased[pos.row][pos.col] = true;
                            }
                        });

                        erased[row + k][col] = true;
                        ToEraseFromPf.push([row + k, col]);
                    }
                }
            }
        }
        
        if(!erasedAny) 
            return 0;

        for(let i = 0; i < ToEraseFromPf.length; i++) {
            let row_erase = ToEraseFromPf[i][0];
            let col_erase = ToEraseFromPf[i][1];
            if(this.pf[row_erase][col_erase] == null) {
                continue;
            }
            let id = this.pf[row_erase][col_erase]
            this.pfObjects[id].DeletePos(row_erase, col_erase);
            if(this.pfObjects[id].positions.length == 0) {
                this.pfObjects.delete(id);
            }
            this.pf[row_erase][col_erase] = null;
        }

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, this.ERASE_ANIMATION_TIME);
        }).then(
            () => {}
        );       

        if(erasedVirus) {
            this.scoreboards["current"].Update(this.points);
            this.scoreboards["virus-count"].Update(this.virus_count);
            localStorage.setItem("record", this.points);
        }

        this.blockMoves = true;
        this.GameLoopProperties.timeStep = 50;
        this.GameLoopProperties.delta = 0.0;

        // Update blocks that will fall because of erase
        for(let row = this.rows - 2; row >= 0; row--) {
            for(let col = 0; col < this.cols; col++) {
                if(this.pf[row][col] == null || !erased[row + 1][col] || erased[row][col]) continue;
                let block_fall = true;
                this.pfObjects[this.pf[row][col]].positions.forEach((pos, indx) => {
                    if(pos.row == this.pfObjects[this.pf[row][col]].GetLowestRow() && this.pf[pos.row + 1][pos.col] != null && !erased[pos.row + 1][pos.col]) {
                        block_fall = false;
                    }
                });
                if(block_fall) {
                    this.pfObjects[this.pf[row][col]].positions.forEach((pos, indx) => {
                        erased[pos.row][pos.col] = true;
                    });
                    this.fallingBlocks.add(this.pf[row][col]);
                }
            }
        }

        this.fallingBlocks = new Set(
            Array.from(this.fallingBlocks).sort((block1, block2) => {
                return this.pfObjects[block2].GetLowestRow() - this.pfObjects[block1].GetLowestRow();
            })
        );
        
        return this.ERASE_ANIMATION_TIME;
    }

    Render() {
        // Update drMario playfield
        for(let row = 0; row < this.drMario.rows; row++) {
            for(let col = 0; col < this.drMario.cols; col++) {
                const tile = document.getElementById(`pill-fly-field${row}-${col}`);
                if(this.drMario.pf[row][col] == null) {
                    tile.style.backgroundImage = null;
                    continue;
                }
                let id = this.drMario.pf[row][col];
                if(id == "pill") {
                    this.drMario.current_pill.UpdateImg();
                }
            }
        }

        // Update magnifier viruses
        this.magnifierViruses.forEach((value, key) => {
            value.UpdateAnimation();
        });

        // Render Tiles
        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                const tile = document.getElementById(`pf${row}-${col}`);
                if(this.pf[row][col] == null) {
                    tile.style.backgroundImage = null;
                    continue;
                }
                let id = this.pf[row][col].split("-")[0];
                if(id == "pill") {
                    this.current_pill.UpdateImg();
                }
                else if(id == "block") {
                    this.pfObjects[this.pf[row][col]].UpdateImg();
                }
                else { // virus
                    this.pfObjects[this.pf[row][col]].UpdateAnimation();
                }
            }
        }
    }
}