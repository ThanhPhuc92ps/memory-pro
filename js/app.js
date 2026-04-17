// app.js — State, init, và glue code

// --- State tập trung ---
const State = {
    notes: [],
    currentTab: null,
    currentNote: null,
    lastNoteId: null,

    getCategories() {
        return [...new Set(this.notes.map(n => n.cat || 'Chung'))].sort();
    }
};

// --- App logic ---
const App = {
    async init() {
        await this.loadData();
        UI.renderTabs();
        UI.renderMain();
        UI.setupSmartInput('addText');
        UI.setupSmartInput('editText');
    },

    async loadData() {
        State.notes = await DB.getAll();
    },

    async refresh() {
        await this.loadData();
        UI.renderTabs();
        UI.renderMain();
    },

    switchTab(cat) {
        State.currentTab = cat;
        State.lastNoteId = null;
        UI.renderTabs();
        UI.renderMain();
        UI.updateTTSBtn();
    },

    mixNote() {
        if (!State.currentTab) return;
        const filtered = State.notes.filter(n => (n.cat || 'Chung') === State.currentTab);
        if (filtered.length === 0) { this.switchTab(null); return; }

        const note = Cards.pickNote(filtered, State.lastNoteId);
        State.currentNote = note;
        State.lastNoteId = note.id;
        UI.renderCard(note);
    },

    // --- CRUD ---
    async saveNewNote() {
        const text = document.getElementById('addText').value.trim();
        const cat = document.getElementById('addCat').value.trim() || 'Chung';
        const prio = parseInt(document.getElementById('addPrio').value) || 5;
        if (!text) return;

        await DB.add({ text, cat, prio });
        await this.refresh();
        UI.closeModal('addModal');
        document.getElementById('addText').value = '';
    },

    async updateNote() {
        await DB.update(State.currentNote.id, {
            text: document.getElementById('editText').value,
            cat: document.getElementById('editCat').value,
            prio: parseInt(document.getElementById('editPrio').value) || 5
        });
        await this.refresh();
        UI.closeModal('editModal');
    },

    async deleteNote() {
        if (!confirm('Xóa thẻ này?')) return;
        await DB.delete(State.currentNote.id);
        await this.refresh();
        UI.closeModal('editModal');
    },

    // --- Export / Import ---
    exportData() {
        const blob = new Blob([JSON.stringify(State.notes, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'memory_data.json';
        a.click();
    },

    importData() {
        const file = document.getElementById('importFile').files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (confirm('Ghi đè toàn bộ dữ liệu?')) {
                    await DB.clear();
                    await DB.bulkAdd(imported);
                    location.reload();
                }
            } catch {
                alert('Lỗi file!');
            }
        };
        reader.readAsText(file);
    },

    toggleTTS() {
        TTS.toggle(State.currentTab);
        UI.updateTTSBtn();
    }
};

// Khởi động
App.init();
