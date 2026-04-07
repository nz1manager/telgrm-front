const display = document.getElementById('coefficient-number');
// Localhost yoki VPS server manzili
const socket = new WebSocket('ws://localhost:3000'); 

socket.onmessage = (event) => {
    // 1. JSON.parse() ni faqat bir marta chaqiramiz
    const msg = JSON.parse(event.data);
    const data = msg.push?.pub?.data;

    if (!data) return;

    // 2. EventType ni tekshirish (Switch ishlatish tezroq)
    switch (data.eventType) {
        case "changeCoefficient":
            // "next" dagi qiymatni chiqarish - bu sizga bir necha millisekund yutuq beradi
            display.textContent = data.next[0].toFixed(2) + "x";
            display.style.color = "white";
            break;

        case "stopCoefficient":
            display.textContent = data.finalValue.toFixed(2) + "x";
            display.style.color = "#ff0000"; // Qizil
            break;

        case "changeState":
            if (data.state === "waiting") {
                display.textContent = "0.00x";
                display.style.color = "#aaaaaa"; // Kutish holati rangi
            }
            break;
    }
};
