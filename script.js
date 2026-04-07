// 1. Ulanish
const socket = new WebSocket('ws://localhost:3000');

// 2. Elementlarni bir marta e'lon qilamiz
const display = document.getElementById('coefficient-number');
let frameRequested = false;

socket.onmessage = function(event) {
    // 3. Millisekundlik filtr (Brauzer chizishga ulgurmasa, xabarni tashlab yuboradi)
    if (frameRequested) return;
    frameRequested = true;

    requestAnimationFrame(() => {
        const raw = event.data;

        // 4. TEZKOR QIDIRUV (JSON.parse-siz)
        if (raw.indexOf('"next":[') !== -1) {
            const parts = raw.split('"next":[');
            if (parts[1]) {
                const val = parts[1].split(']')[0];
                // DOM yangilash
                display.textContent = val + "x";
                display.style.color = "white";
            }
        } 
        // 5. STOP: O'yin to'xtaganini ilib olish
        else if (raw.indexOf('stopCoefficient') !== -1) {
            const parts = raw.split('"finalValue":');
            if (parts[1]) {
                const val = parts[1].split('}')[0];
                display.textContent = val + "x";
                display.style.color = "#ff0000"; // Qizil
            }
        }
        
        // 6. Kutish holati (Navbatdagi o'yin)
        else if (raw.indexOf('"state":"waiting"') !== -1) {
            display.textContent = "0.00x";
            display.style.color = "#555";
        }

        frameRequested = false;
    });
};

socket.onopen = () => console.log("✅ Local Backend ulandi!");
socket.onclose = () => console.warn("🔌 Backend uzildi!");
