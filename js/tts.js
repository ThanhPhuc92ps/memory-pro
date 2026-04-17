// tts.js — Text-to-Speech module

const TTS = {
    settings: JSON.parse(localStorage.getItem('ttsTabSettings')) || {},

    isEnabled(tabKey) {
        const key = tabKey || "Home_Default";
        return this.settings[key] !== false;
    },

    toggle(tabKey) {
        const key = tabKey || "Home_Default";
        this.settings[key] = !this.isEnabled(key);
        localStorage.setItem('ttsTabSettings', JSON.stringify(this.settings));
    },

    speak(text, tabKey) {
        if (!this.isEnabled(tabKey) || !text) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }
};
