// tts.js — Text-to-Speech logic

const TTS = {
    _enabled: {}, // { tabName: bool }

    isEnabled(tab) {
        if (tab === null) return false;
        return this._enabled[tab] !== false; // default: ON
    },

    toggle(tab) {
        if (tab === null) return;
        this._enabled[tab] = !this.isEnabled(tab);
    },

    speak(text, tab) {
        if (!this.isEnabled(tab)) return;
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = 'en-US';
        utt.rate = 0.9;
        window.speechSynthesis.speak(utt);
    }
};
