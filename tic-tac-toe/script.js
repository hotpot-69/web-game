const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const strikeLine = document.getElementById('strike');
const pveBtn = document.getElementById('pve-btn');
const pvpBtn = document.getElementById('pvp-btn');
const difficultySelect = document.getElementById('difficulty');
const difficultySettings = document.getElementById('difficulty-settings');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let isPvP = false;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const winClasses = ["strike-row-1", "strike-row-2", "strike-row-3", "strike-col-1", "strike-col-2", "strike-col-3", "strike-diag-1", "strike-diag-2"];

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== "" || !isGameActive) return;

    makeMove(index, currentPlayer);
    
    if (isGameActive && !isPvP && currentPlayer === "O") {
        document.body.style.pointerEvents = "none";
        setTimeout(() => {
            botMove();
            document.body.style.pointerEvents = "auto";
        }, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());
    
    if (checkWinner(board, player)) {
        statusText.innerText = `PLAYER ${player} WINS!`;
        isGameActive = false;
        setTimeout(resetGame, 2000);
        return;
    }

    if (!board.includes("")) {
        statusText.innerText = "DRAW!";
        isGameActive = false;
        setTimeout(resetGame, 2000);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `PLAYER ${currentPlayer}'S TURN`;
}

function checkWinner(b, p) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b1, c] = winConditions[i];
        if (b[a] === p && b[b1] === p && b[c] === p) {
            strikeLine.className = `strike ${winClasses[i]}`;
            return true;
        }
    }
    return false;
}

function botMove() {
    if (!isGameActive) return;
    const diff = difficultySelect.value;
    let move;
    
    if (diff === 'easy') move = getRandomMove();
    else if (diff === 'medium') move = Math.random() > 0.5 ? minimax(board, "O").index : getRandomMove();
    else move = minimax(board, "O").index;
    
    makeMove(move, "O");
}

function getRandomMove() {
    const available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    
    if (checkWinSimple(newBoard, "X")) return { score: -10 };
    if (checkWinSimple(newBoard, "O")) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = { index: availSpots[i] };
        newBoard[availSpots[i]] = player;
        move.score = minimax(newBoard, player === "O" ? "X" : "O").score;
        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) { bestScore = moves[i].score; bestMove = i; }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) { bestScore = moves[i].score; bestMove = i; }
        }
    }
    return moves[bestMove];
}

function checkWinSimple(b, p) {
    return winConditions.some(c => b[c[0]] === p && b[c[1]] === p && b[c[2]] === p);
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = Math.random() > 0.5 ? "X" : "O";
    statusText.innerText = `PLAYER ${currentPlayer}'S TURN`;
    strikeLine.className = "strike";
    cells.forEach(c => { c.innerText = ""; c.className = "cell"; });
    
    // If bot goes first in PvE mode
    if (!isPvP && currentPlayer === "O") {
        document.body.style.pointerEvents = "none";
        setTimeout(() => {
            botMove();
            document.body.style.pointerEvents = "auto";
        }, 500);
    }
}

cells.forEach(c => c.addEventListener('click', handleCellClick));
document.getElementById('resetBtn').onclick = resetGame;
pveBtn.onclick = () => { isPvP = false; pveBtn.classList.add('active'); pvpBtn.classList.remove('active'); difficultySettings.style.display = 'block'; resetGame(); };
pvpBtn.onclick = () => { isPvP = true; pvpBtn.classList.add('active'); pveBtn.classList.remove('active'); difficultySettings.style.display = 'none'; resetGame(); };

// Initialize neon background particles
function initNeonBackground() {
    const particlesContainer = document.querySelector('.floating-particles');
    const colors = ['blue', 'pink'];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = `particle ${colors[Math.floor(Math.random() * colors.length)]}`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (10 + Math.random() * 30) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        
        particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 10000);
    }
    
    setInterval(createParticle, 400);
}

initNeonBackground();