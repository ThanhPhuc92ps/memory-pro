const TTS = {
    STORAGE_KEY: 'memory_pro_tts_settings',

    getSettings() {
        try {
            // Lấy object tổng ra, nếu chưa có thì trả về {}
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
        } catch (e) { return {}; }
    },

    isEnabled(tabKey) {
        const key = tabKey || "Chung"; // Fallback về tab mặc định
        const settings = this.getSettings();
        // Nếu chưa bao giờ thiết lập cho tab này (undefined), mặc định trả về true
        return settings[key] !== false;
    },

    toggle(tabKey) {
        const key = tabKey || "Chung";
        const settings = this.getSettings();
        
        // Đảo trạng thái riêng cho tab này
        settings[key] = !this.isEnabled(key);
        
        // Lưu ngược cả object vào 1 key duy nhất
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    },

    speak(text, tabKey) {
        if (!text || !this.isEnabled(tabKey)) return;
        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }
};
