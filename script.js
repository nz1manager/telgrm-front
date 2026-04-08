const socket = new WebSocket('ws://localhost:3000');
const display = document.getElementById('coefficient-number');
const wrapper = document.getElementById('counter-wrapper');
const historyBox = document.getElementById('history-wrapper');
const status = document.getElementById('status-label');

let frameRequested = false;

socket.onmessage = (event) => {
    if (frameRequested) return;
    frameRequested = true;

    requestAnimationFrame(() => {
        const raw = event.data;

        // 1. O'YIN KETAYOTGANDA
        if (raw.includes('"next":[')) {
            const val = raw.split('"next":[')[1].split(']')[0];
            display.textContent = val + "x";
            display.className = "flying";
            status.textContent = "FLYING...";
            wrapper.style.borderColor = "#ffffff33";
        } 

        // 2. CRASH (TO'XTASH)
        else if (raw.includes('stopCoefficient')) {
            const final = raw.split('"finalValue":')[1].split('}')[0];
            display.textContent = parseFloat(final).toFixed(2) + "x";
            display.className = "crashed";
            status.textContent = "CRASHED";
            wrapper.style.borderColor = "#ff3e3e";
            
            // Tarixga qo'shish
            pushToHistory(final);
        }

        // 3. KUTISH
        else if (raw.includes('"state":"waiting"')) {
            display.className = "waiting";
            display.textContent = "1.00x";
            status.textContent = "WAITING...";
            wrapper.style.borderColor = "#1f2026";
        }

        frameRequested = false;
    });
};

function pushToHistory(val) {
    const item = document.createElement('div');
    item.className = 'h-item';
    const num = parseFloat(val);
    
    // Rang mantiqi
    if (num < 1.5) item.style.color = "#3498db";
    else if (num < 10) item.style.color = "#9b59b6";
    else item.style.color = "#f1c40f";

    item.textContent = num.toFixed(2) + "x";
    historyBox.prepend(item); // Yangisini boshiga qo'shadi

    if (historyBox.children.length > 12) {
        historyBox.removeChild(historyBox.lastChild);
    }
}
