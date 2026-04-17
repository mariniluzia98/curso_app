class Store {
    constructor() {
        this.baseUrl = '/api';
        if (window.location.protocol === 'file:') {
            this.baseUrl = 'http://localhost:3000/api';
        }
    }

    async getAll(colName) {
        try {
            const res = await fetch(`${this.baseUrl}/${colName}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (err) {
            console.error('API Error:', err);
            return [];
        }
    }

    async add(colName, item) {
        try {
            const res = await fetch(`${this.baseUrl}/${colName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
            return await res.json();
        } catch (err) {
            console.error('API Error:', err);
            return null;
        }
    }

    async generateId(colName) {
        const items = await this.getAll(colName);
        if (!items || items.length === 0) return 1;
        return items.length + 1;
    }
}

const db = new Store();
