const display = document.getElementById('coefficient-number');
const socket = new WebSocket('wss://rulsz.onrender.com/ws');

// Browser renderingni tezlashtirish uchun pre-define
let lastValue = "";

socket.onmessage = function(event) {
    // 1. Eng tezkor usul: Ma'lumotni string ko'rinishida tekshirish (Parsingdan oldin)
    const raw = event.data;
    
    // Millisekund yutish: JSON.parse qilishdan oldin string ichidan qidiramiz
    if (raw.indexOf('changeCoefficient') !== -1) {
        try {
            const data = JSON.parse(raw).pub.data;
            const val = data.next[0].toFixed(2) + "x";
            
            // DOM-ga faqat qiymat o'zgarsa yozamiz (CPU tejash)
            if (lastValue !== val) {
                display.textContent = val; 
                display.style.color = "white";
                lastValue = val;
            }
        } catch (e) {}
    } 
    else if (raw.indexOf('stopCoefficient') !== -1) {
        try {
            const data = JSON.parse(raw).pub.data;
            display.textContent = data.finalValue.toFixed(2) + "x";
            display.style.color = "#ff4444"; // Qizil
        } catch (e) {}
    }
};

// Heartbeat (Ulanish uzilib qolmasligi uchun)
setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send('{"type":1}'); // Centrifuge ping formati
    }
}, 20000);
