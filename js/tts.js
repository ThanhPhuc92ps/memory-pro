// tts.js — Hệ thống phát âm thanh có trí nhớ
const TTS = {
    isEnabled(tab) {
        if (!tab) return false;
        // Đọc giá trị từ bộ nhớ máy
        const saved = localStorage.getItem('tts_enabled_' + tab);
        // Nếu là lần đầu tiên (null), mặc định là true (Bật)
        return saved === null ? true : saved === 'true';
    },

    toggle(tab) {
        if (!tab) return;
        const newState = !this.isEnabled(tab);
        // Lưu chặt vào máy dạng chuỗi 'true' hoặc 'false'
        localStorage.setItem('tts_enabled_' + tab, newState.toString());
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
