// tts.js

const TTS = {
    // 1. Lấy dữ liệu đã lưu từ localStorage khi vừa load trang
    _enabled: JSON.parse(localStorage.getItem('memory_tts_config') || '{}'),

    isEnabled(tab) {
        if (tab === null) return false;
        // Nếu tab này chưa từng được thiết lập, mặc định là true (BẬT)
        return this._enabled[tab] !== false;
    },

    toggle(tab) {
        if (tab === null) return;
        this._enabled[tab] = !this.isEnabled(tab);
        
        // 2. Lưu lại vào localStorage mỗi khi người dùng bấm nút loa
        localStorage.setItem('memory_tts_config', JSON.stringify(this._enabled));
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
