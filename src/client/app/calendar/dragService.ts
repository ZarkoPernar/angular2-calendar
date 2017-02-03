import {Injectable} from '@angular/core'

export interface MouseDrag {
    mouseOffsetY?: number
    mouseOffsetX?: number
    resize?: boolean
}

@Injectable()
export class DragService {
    public listeners: [Function]

    constructor() {
        
    }

    emit(event: MouseDrag) {
        if (this.listeners && this.listeners.length) {
            this.listeners.forEach(cb => cb(event))
        }
    }

    subscribe(cb: Function) {
        if (!this.listeners) {
            this.listeners = [cb]
        } else {
            this.listeners.push(cb)
        }
    }
}

