// tts.js — Text-to-Speech logic (Có lưu trạng thái vào bộ nhớ máy)

const TTS = {
    // Hàm kiểm tra xem Tab này có được bật loa không
    isEnabled(tab) {
        if (tab === null) return false;
        
        // Đọc từ bộ nhớ máy (localStorage)
        const savedStatus = localStorage.getItem('tts_enabled_' + tab);
        
        // Nếu chưa từng lưu gì (lần đầu dùng), mặc định trả về true (BẬT)
        if (savedStatus === null) return true;
        
        // localStorage lưu dạng chuỗi nên phải so sánh với 'true'
        return savedStatus === 'true';
    },

    // Hàm đảo ngược trạng thái Tắt <-> Bật
    toggle(tab) {
        if (tab === null) return;
        
        const currentState = this.isEnabled(tab);
        const newState = !currentState;
        
        // Lưu trạng thái mới vào bộ nhớ máy dưới dạng chuỗi
        localStorage.setItem('tts_enabled_' + tab, newState.toString());
    },

    // Hàm phát âm thanh
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
