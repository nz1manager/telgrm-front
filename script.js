const socket = new WebSocket('wss://rulsz.onrender.com/ws');

const display = document.getElementById('coefficient-number');

socket.onopen = () => {
    console.log("✅ Render WebSocket ulanishi muvaffaqiyatli!");
};

socket.onmessage = function(event) {
    console.log("📩 Ma'lumot keldi:", event.data); // Kelayotgan xabarni konsolda ko'rish
    
    try {
        const rawData = JSON.parse(event.data);
        
        // Agar ma'lumot Centrifuge formatida bo'lsa
        if (rawData.pub && rawData.pub.data) {
            const payload = rawData.pub.data;
            
            if (payload.eventType === "changeCoefficient") {
                display.innerText = payload.next[0].toFixed(2) + "x";
                display.style.color = "white";
            } 
            else if (payload.eventType === "stopCoefficient") {
                display.innerText = payload.finalValue.toFixed(2) + "x";
                display.style.color = "red";
                setTimeout(() => { display.style.color = "white"; }, 2000);
            }
        } else {
            console.warn("⚠️ Noma'lum formatdagi ma'lumot:", rawData);
        }
    } catch (e) {
        console.error("❌ JSON parsing xatosi:", e);
    }
};

socket.onerror = (error) => {
    console.error("❌ WebSocket xatosi:", error);
};

socket.onclose = () => {
    console.warn("🔌 Render bilan aloqa uzildi!");
};
