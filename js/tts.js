// tts.js — Text-to-Speech module

const TTS = {
    // Tải cài đặt từ localStorage hoặc khởi tạo object rỗng nếu chưa có
    settings: JSON.parse(localStorage.getItem('ttsTabSettings')) || {},

    /**
     * Kiểm tra trạng thái TTS của một tab
     * Mặc định là true (bật) nếu chưa có cấu hình
     */
    isEnabled(tabKey) {
        const key = tabKey || "Home_Default";
        // Sử dụng ?? true để mặc định bật nếu chưa từng thiết lập
        // Nếu đã lưu là false, nó sẽ trả về false chính xác
        return this.settings[key] ?? true;
    },

    /**
     * Đảo ngược trạng thái và lưu vào localStorage
     */
    toggle(tabKey) {
        const key = tabKey || "Home_Default";
        const currentState = this.isEnabled(key);
        
        // Đảo ngược trạng thái hiện tại
        this.settings[key] = !currentState;
        
        // Lưu lại vào bộ nhớ trình duyệt
        localStorage.setItem('ttsTabSettings', JSON.stringify(this.settings));
        
        // Trả về giá trị mới để có thể cập nhật UI nếu cần
        return this.settings[key];
    },

    /**
     * Thực hiện phát âm thanh
     */
    speak(text, tabKey) {
        const key = tabKey || "Home_Default";
        
        // Dừng lại nếu tính năng bị tắt hoặc không có text
        if (!this.isEnabled(key) || !text) return;

        // Hủy các yêu cầu phát âm thanh đang chờ để tránh chồng chéo
        window.speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        
        window.speechSynthesis.speak(u);
    }
};
