// Localhost:3000 ga ulanamiz (o'zimizning backend serverga)
const socket = new WebSocket('ws://localhost:3000');

const display = document.getElementById('coefficient-number');

socket.onmessage = function(event) {
    try {
        const rawData = JSON.parse(event.data);
        const payload = rawData.push?.pub?.data;

        if (!payload) return;

        if (payload.eventType === "changeCoefficient") {
            // "next" ni ko'rsatish tezroq natija beradi
            display.textContent = payload.next[0].toFixed(2) + "x";
            display.style.color = "white";
        } 
        else if (payload.eventType === "stopCoefficient") {
            display.textContent = payload.finalValue.toFixed(2) + "x";
            display.style.color = "red";
        }
    } catch (e) {
        // Xato bo'lsa indamaymiz (tezlik uchun)
    }
};
