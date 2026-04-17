// ui.js — UI rendering: tabs, modals, views

const UI = {
    // --- Tabs ---
    renderTabs() {
        const bar = document.getElementById('tab-bar');
        bar.innerHTML = '';

        const home = document.createElement('div');
        home.className = `tab ${!State.currentTab ? 'active' : ''}`;
        home.textContent = '🏠';
        home.addEventListener('click', () => App.switchTab(null));
        bar.appendChild(home);

        State.getCategories().forEach(c => {
            const tab = document.createElement('div');
            tab.className = `tab ${State.currentTab === c ? 'active' : ''}`;
            tab.textContent = c;
            tab.addEventListener('click', () => App.switchTab(c));
            bar.appendChild(tab);
        });
    },

    // --- Main View ---
    renderMain() {
        this.updateTTSBtn();
        const view = document.getElementById('main-view');

        if (!State.currentTab) {
            const cats = State.getCategories();
            if (cats.length === 0) {
                view.innerHTML = `<div style="text-align:center; margin-top:50px; color:#666;">Chưa có dữ liệu.</div>`;
                return;
            }
            const grid = document.createElement('div');
            grid.className = 'cat-grid';
            cats.forEach(c => {
                const item = document.createElement('div');
                item.className = 'cat-item';
                item.textContent = c;
                item.addEventListener('click', () => App.switchTab(c));
                grid.appendChild(item);
            });
            view.innerHTML = '';
            view.appendChild(grid);
        } else {
            App.mixNote();
        }
    },

    // --- Card ---
    renderCard(note) {
        const view = document.getElementById('main-view');

        const card = document.createElement('div');
        card.className = 'card';

        const meta = document.createElement('div');
        meta.className = 'card-meta';

        const prioSpan = document.createElement('span');
        prioSpan.textContent = `Prio: ${note.prio}`;

        const editSpan = document.createElement('span');
        editSpan.textContent = '✏️';
        editSpan.style.cssText = 'color:var(--primary); padding:5px; cursor:pointer;';
        editSpan.addEventListener('click', () => UI.openEdit());

        meta.appendChild(prioSpan);
        meta.appendChild(editSpan);

        const contentWrap = document.createElement('div');
        contentWrap.addEventListener('click', (e) => {
            if (!e.target.classList.contains('cloze')) App.mixNote();
        });

        const h2 = document.createElement('h2');
        h2.id = 'note-content';
        h2.appendChild(Cards.formatCloze(note.text));

        contentWrap.appendChild(h2);
        card.appendChild(meta);
        card.appendChild(contentWrap);

        view.innerHTML = '';
        view.appendChild(card);
    },

    // --- Quick Tab Badges ---
    renderQuickTabs(containerId, inputId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        State.getCategories().forEach(c => {
            const span = document.createElement('span');
            span.className = 'qt-badge';
            span.textContent = c;
            span.addEventListener('click', () => {
                document.getElementById(inputId).value = c;
            });
            container.appendChild(span);
        });
    },

    // --- TTS Button ---
 updateTTSBtn() {
    const btn = document.getElementById('tts-btn');
    const label = document.getElementById('tts-label');
    if (!btn || !label) return;

    // Lấy trạng thái từ tts.js (đã có bộ nhớ localStorage)
    const enabled = TTS.isEnabled(State.currentTab);
    
    // Cập nhật giao diện
    btn.classList.toggle('active', enabled);
    label.textContent = `Loa: ${enabled ? 'BẬT' : 'TẮT'}`;
},

    // --- Modals ---
    openModal(id) {
        document.getElementById(id).style.display = 'flex';
        if (id === 'addModal') this.renderQuickTabs('quick-tabs-list', 'addCat');
    },

    closeModal(id) {
        document.getElementById(id).style.display = 'none';
    },

    openEdit() {
        const note = State.currentNote;
        document.getElementById('editText').value = note.text;
        document.getElementById('editCat').value = note.cat;
        document.getElementById('editPrio').value = note.prio;
        this.renderQuickTabs('edit-quick-tabs-list', 'editCat');
        this.openModal('editModal');
    },

    // --- Smart Input: gõ [ tự wrap ---
    setupSmartInput(id) {
        const el = document.getElementById(id);
        el.addEventListener('beforeinput', (e) => {
            if (e.data === '[') {
                e.preventDefault();
                const start = el.selectionStart, end = el.selectionEnd;
                const sel = el.value.substring(start, end);
                el.value = el.value.substring(0, start) + '[' + sel + ']' + el.value.substring(end);
                const pos = start + (sel ? sel.length + 2 : 1);
                el.setSelectionRange(pos, pos);
            }
        });
    }
};

