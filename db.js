// db.js — Database layer (Dexie / IndexedDB)
// Sau này có thể thay bằng API calls tới Python server mà không cần sửa file khác

const db = new Dexie("MemoryProDB");
db.version(1).stores({ notes: '++id, cat, prio' });

const DB = {
    async getAll() {
        return await db.notes.toArray();
    },

    async add(note) {
        return await db.notes.add(note);
    },

    async update(id, changes) {
        return await db.notes.update(id, changes);
    },

    async delete(id) {
        return await db.notes.delete(id);
    },

    async clear() {
        return await db.notes.clear();
    },

    async bulkAdd(notes) {
        // Strip id để tránh conflict khi import
        return await db.notes.bulkAdd(notes.map(({ id, ...rest }) => rest));
    }
};

