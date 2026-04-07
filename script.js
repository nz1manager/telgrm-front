// Localhost:3000 ga ulanamiz (o'zimizning backend serverga)
const socket = new WebSocket('ws://localhost:3000');

const display = document.getElementById('coefficient-number');

let frameRequested = false;
const display = document.getElementById('coefficient-number');

socket.onmessage = function(event) {
    // 1. Agar brauzer hali oldingi kadrni chizib ulgurmagan bo'lsa, kutib turadi
    if (frameRequested) return;
    frameRequested = true;

    requestAnimationFrame(() => {
        const raw = event.data;

        // 2. TEZKOR QIDIRUV: JSON.parse ishlatmasdan raqamni topish
        if (raw.indexOf('"next":[') !== -1) {
            const parts = raw.split('"next":[');
            if (parts[1]) {
                const val = parts[1].split(']')[0];
                display.textContent = val + "x"; // parseFloat ham vaqt oladi, shunchaki stringni chiqaramiz
                display.style.color = "white";
            }
        } 
        // 3. STOP: O'yin to'xtaganini ilib olish
        else if (raw.indexOf('stopCoefficient') !== -1) {
            const parts = raw.split('"finalValue":');
            if (parts[1]) {
                const val = parts[1].split('}')[0];
                display.textContent = val + "x";
                display.style.color = "#ff0000"; // Qizil
            }
        }

        frameRequested = false;
    });
};
