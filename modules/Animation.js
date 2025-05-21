export class Animation {
    url;
    frames_duration;
    frames_it = -1;
    current_tick = 0;
    object_id;

    constructor(url, frames_duration, object_id) {
        this.url = url;
        this.frames_duration = frames_duration;
        this.object_id = object_id;

        this.NextFrame();
    }

    Update() {
        this.current_tick++;
        if(this.frames_duration[this.frames_it] == this.current_tick) {
            this.current_tick = 0;
            return this.NextFrame();
        }
    }

    NextFrame() {
        // If animation made full cycle
        let fullCycle = false;
        if(this.frames_it == this.frames_duration.length - 1) {
            fullCycle = true;
        }

        this.frames_it = (this.frames_it + 1) % this.frames_duration.length;
    
        const object = document.getElementById(this.object_id);
        object.style.backgroundImage = `url("${this.url}_${this.frames_it}.png")`;
    
        return fullCycle
    }
}