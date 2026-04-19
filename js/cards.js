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

    // ── Markdown + Cloze renderer ──────────────────────────────────────
    // Dùng cho hiển thị thẻ và preview trong modal
    formatClozeMarkdown(text) {
        // Bước 1: Tách cloze token ra, thay bằng placeholder an toàn
        const clozeList = [];
        const placeholdered = text.replace(/\[([^\]\[]*?)(?:\|([^\]\[]*?))?\]/g, (_, word, hint) => {
            const i = clozeList.length;
            clozeList.push({ word, hint: hint || '' });
            return `\x00CLOZE${i}\x00`;
        });

        // Bước 2: Parse markdown
        let html;
        if (typeof marked !== 'undefined') {
            marked.setOptions({ breaks: true });
            html = marked.parse(placeholdered);
        } else {
            // Fallback nếu marked chưa load
            html = '<p>' + placeholdered.replace(/\n/g, '<br>') + '</p>';
        }

        // Bước 3: Thay placeholder bằng <span class="cloze">
        html = html.replace(/\x00CLOZE(\d+)\x00/g, (_, i) => {
            const { word, hint } = clozeList[parseInt(i)];
            const noHint = !hint;
            return `<span class="cloze${noHint ? ' no-hint' : ''}" data-word="${Cards._esc(word)}" data-hint="${Cards._esc(hint)}">${Cards._esc(hint || word)}</span>`;
        });

        // Bước 4: Build DOM và gắn sự kiện click
        const wrapper = document.createElement('div');
        wrapper.className = 'md-content';
        wrapper.innerHTML = html;
        wrapper.querySelectorAll('.cloze').forEach(span => {
            span.addEventListener('click', e => Cards.toggleCloze(e, span));
        });
        return wrapper;
    },

    _esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    // ── Legacy plain-text cloze (giữ lại để tương thích) ─────────────
    formatCloze(text) {
        return Cards.formatClozeMarkdown(text);
    },

    // ── Cloze toggle ──────────────────────────────────────────────────
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

    // ── Reveal từng bước (👁 button) ──────────────────────────────────
    revealStep() {
        const first = document.querySelector('.cloze:not(.revealed)');
        const tab = (typeof State !== 'undefined' && State.currentTab) ? State.currentTab : 'home';
        const mode = localStorage.getItem(`reveal_mode_${tab}`) || 'full';

        if (first) {
            const word = first.dataset.word;

            if (mode === 'consonants' && first.dataset.state !== 'consonant-shown') {
                first.textContent = word.replace(/[aeiouyAEIOUY]/g, '_');
                first.dataset.state = 'consonant-shown';
                TTS.speak(word, State.currentTab);
            } else {
                Cards.toggleCloze({ stopPropagation: () => {} }, first);
                delete first.dataset.state;
            }
        } else {
            // Reset tất cả
            document.querySelectorAll('.cloze').forEach(el => {
                el.classList.remove('revealed');
                delete el.dataset.state;
                el.textContent = el.dataset.hint || el.dataset.word;
            });
        }
    },

    // ── Reveal / ẩn tất cả (📢 button) ───────────────────────────────
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
            cloze.textContent = word.replace(/[aeiouyAEIOUY]/g, '_');
            TTS.speak(word, State.currentTab);
        }
    }
};
