// cards.js — Card display, cloze, and mix logic

const Cards = {
    pickNote(notes, lastNoteId) {
        if (notes.length === 0) return null;

        const candidates = notes.length > 1 && lastNoteId !== null
            ? notes.filter(n => n.id !== lastNoteId)
            : notes;

        const uniquePrios = [...new Set(candidates.map(n => Math.max(1, parseInt(n.prio) || 1)))];
        const totalWeight = uniquePrios.reduce((a, b) => a + b, 0);

        let rand = Math.random() * totalWeight;
        let selectedPrio = uniquePrios[0];
        for (const p of uniquePrios) {
            rand -= p;
            if (rand <= 0) { selectedPrio = p; break; }
        }

        const pool = candidates.filter(n => Math.max(1, parseInt(n.prio) || 1) === selectedPrio);
        return pool[Math.floor(Math.random() * pool.length)];
    },

    formatCloze(text) {
        const container = document.createElement('span');
        const parts = text.split(/(\[.*?(?:\|.*?)?\])/g);

        parts.forEach(part => {
            const match = part.match(/^\[(.*?)(?:\|(.*?))?\]$/);
            if (match) {
                const [, word, hint] = match;
                const span = document.createElement('span');
                span.className = 'cloze' + (hint ? '' : ' no-hint');
                span.dataset.word = word;
                span.dataset.hint = hint || '';
                span.textContent = hint || word;
                span.addEventListener('click', (e) => Cards.toggleCloze(e, span));
                container.appendChild(span);
            } else {
                container.appendChild(document.createTextNode(part));
            }
        });

        return container;
    },

    toggleCloze(e, el) {
        e.stopPropagation();
        const word = el.dataset.word;
        const hint = el.dataset.hint;

        if (!el.classList.contains('revealed')) {
            el.textContent = word;
            el.classList.add('revealed');
            TTS.speak(word, State.currentTab);
        } else {
            el.textContent = hint || word;
            el.classList.remove('revealed');
        }
    },

    // Thay thế hàm revealStep cũ trong cards.js
    revealStep() {
        const first = document.querySelector('.cloze:not(.revealed)');
        const tab = (typeof State !== 'undefined' && State.currentTab) ? State.currentTab : 'home';
        const mode = localStorage.getItem(`reveal_mode_${tab}`) || 'full';
    
        if (first) {
            const word = first.dataset.word;
            
            // Nếu chọn chế độ phụ âm VÀ thẻ này chưa ở trạng thái hiện phụ âm
            if (mode === 'consonants' && first.dataset.state !== 'consonant-shown') {
                const consonantOnly = word.replace(/[aeiouyAEIOUY]/g, '_');
                first.textContent = consonantOnly;
                first.dataset.state = 'consonant-shown'; // Đánh dấu trạng thái trung gian
                TTS.speak(word, State.currentTab); // Phát âm để hỗ trợ
            } else {
                // Hiện đầy đủ từ ẩn
                Cards.toggleCloze({ stopPropagation: () => {} }, first);
            }
        } else {
            // Nếu đã hiện hết, nhấn lần nữa để ẩn tất cả (Reset)
            document.querySelectorAll('.cloze').forEach(el => {
                el.classList.remove('revealed');
                delete el.dataset.state; // Xóa trạng thái trung gian
                el.textContent = el.dataset.hint || el.dataset.word;
            });
        }
    },


    toggleAll() {
        const all = document.querySelectorAll('.cloze');
        const anyHidden = Array.from(all).some(el => !el.classList.contains('revealed'));
        all.forEach(el => {
            if (anyHidden) {
                el.textContent = el.dataset.word;
                el.classList.add('revealed');
            } else {
                el.textContent = el.dataset.hint || el.dataset.word;
                el.classList.remove('revealed');
            }
        });
    },

    revealConsonants() {
        const cloze = document.querySelector('.cloze:not(.revealed)');
        if (cloze) {
            const word = cloze.dataset.word;
            const consonantOnly = word.replace(/[aeiouyAEIOUY]/g, '_');
            cloze.textContent = consonantOnly;
            TTS.speak(word, State.currentTab);
        }
    }
};
