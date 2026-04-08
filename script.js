const socket = new WebSocket('ws://localhost:3000');

const display = document.getElementById('coefficient-number');
const historyBar = document.getElementById('history-bar');
const aiPrediction = document.getElementById('ai-prediction');
const winProb = document.getElementById('win-probability');
const gameState = document.getElementById('game-state');

let gameHistory = [];
let frameRequested = false;

socket.onmessage = function(event) {
    if (frameRequested) return;
    frameRequested = true;

    requestAnimationFrame(() => {
        const raw = event.data;

        // 1. JORIY RAQAMNI USHLASH (next ishlatamiz tezlik uchun)
        if (raw.indexOf('"next":[') !== -1) {
            const val = raw.split('"next":[')[1].split(']')[0];
            display.textContent = val + "x";
            display.style.color = "white";
            gameState.textContent = "O'yin davom etmoqda...";
        } 

        // 2. STOP (O'yin tugashi)
        else if (raw.indexOf('stopCoefficient') !== -1) {
            const finalVal = parseFloat(raw.split('"finalValue":')[1].split('}')[0]);
            display.textContent = finalVal.toFixed(2) + "x";
            display.style.color = "#ff3e3e";
            gameState.textContent = "To'xtadi!";
            
            updateHistory(finalVal);
            calculatePrediction();
        }

        // 3. KUTISH (Yangi o'yin)
        else if (raw.indexOf('"state":"waiting"') !== -1) {
            display.textContent = "0.00x";
            display.style.color = "#848e9c";
            gameState.textContent = "Keyingi raund kutilmoqda...";
        }

        frameRequested = false;
    });
};

function updateHistory(val) {
    gameHistory.push(val);
    if (gameHistory.length > 8) gameHistory.shift();

    historyBar.innerHTML = '';
    gameHistory.slice().reverse().forEach(num => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.style.color = num >= 2 ? '#00ff88' : '#ff3e3e';
        item.textContent = num.toFixed(2) + 'x';
        historyBar.appendChild(item);
    });
}

function calculatePrediction() {
    if (gameHistory.length < 3) return;

    // ODDIY TAHLIL ALGORITMI (Trend Recognition)
    const last3 = gameHistory.slice(-3);
    const avg = last3.reduce((a, b) => a + b, 0) / 3;

    let prediction = 0;
    let probability = 0;

    // Agar ketma-ket 2-3 marta kichik (qizil) chiqsa
    if (avg < 1.8) {
        prediction = (Math.random() * (2.5 - 2.0) + 2.0).toFixed(2);
        probability = 75;
    } 
    // Agar oxirgisi juda katta bo'lsa (Xavfli zona)
    else if (last3[2] > 10) {
        prediction = (Math.random() * (1.5 - 1.1) + 1.1).toFixed(2);
        probability = 85;
    }
    else {
        prediction = (Math.random() * (2.0 - 1.5) + 1.5).toFixed(2);
        probability = 60;
    }

    aiPrediction.textContent = prediction + "x";
    winProb.textContent = probability + "%";
}

socket.onopen = () => console.log("✅ Tahlil tizimi tayyor!");
