interface Item {
    name: string,
    //createdAt: number,
    startDate: string,
    endDate?: string
}

let CalendarService = {
    items: [
        {
            name: 'Hello!',
            startDate: '03.11.2016'
        },
        {
            name: 'Hello Again!',
            startDate: '03.18.2016'
        }
    ],
    event: {
        name: '',
        startDate: ''
    },
    clearNew() {
        this.event = {
            name: '',
            startDate: ''
        }  
    },    
    addNewEvent() {
        this.events.push(this.event)    
        this.clearNew()
    }   
}

export default CalendarService


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}