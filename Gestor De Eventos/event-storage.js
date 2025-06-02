class EventStorage {
    constructor() {
        this.events = [];
        this.loadEvents();
    }

    loadEvents() {
        try {
            const data = localStorage.getItem('events');
            this.events = data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = [];
        }
    }

    saveEvents() {
        try {
            localStorage.setItem('events', JSON.stringify(this.events));
        } catch (error) {
            console.error('Error saving events:', error);
        }
    }

    addEvent(event) {
        event.id = Date.now().toString(); // Unique ID
        this.events.push(event);
        this.saveEvents();
        return event;
    }

    getEvents(filter = 'all') {
        if (filter === 'all') return this.events;
        return this.events.filter(event => event.status === filter);
    }

    getEventById(id) {
        return this.events.find(event => event.id === id);
    }

    updateEvent(id, updatedEvent) {
        const index = this.events.findIndex(event => event.id === id);
        if (index !== -1) {
            this.events[index] = { ...this.events[index], ...updatedEvent };
            this.saveEvents();
            return true;
        }
        return false;
    }

    deleteEvent(id) {
        const index = this.events.findIndex(event => event.id === id);
        if (index !== -1) {
            this.events.splice(index, 1);
            this.saveEvents();
            return true;
        }
        return false;
    }
}
