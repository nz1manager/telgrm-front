// Render backend manzilingizni bu yerga yozasiz
// Agar backend WebSocket bo'lsa:
const socket = new WebSocket('wss://rulsz.onrender.com/ws');

const display = document.getElementById('coefficient-number');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    // 1. Koeffitsientni yangilash
    // Agar changeCoefficient bo'lsa data.current[0], agar stop bo'lsa finalValue
    let value = "0.00";
    
    if (data.pub && data.pub.data) {
        const payload = data.pub.data;
        
        if (payload.eventType === "changeCoefficient") {
            value = payload.next[0].toFixed(2);
            display.style.color = "white"; // O'yin ketyapti - oq rang
        } 
        else if (payload.eventType === "stopCoefficient") {
            value = payload.finalValue.toFixed(2);
            
            // 2. STOP bo'lganda qizil qilish
            display.style.color = "red";
            
            // 2 sekunddan keyin yana oq rangga qaytarish
            setTimeout(() => {
                display.style.color = "white";
            }, 2000);
        }
    }

    display.innerText = value + "x";
};

socket.onopen = () => console.log("Backendga ulandik!");
socket.onerror = (error) => console.error("Xatolik:", error);